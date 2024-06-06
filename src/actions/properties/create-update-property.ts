"use server";

import { auth } from "@/auth";
import { supabase } from "@/lib/supabaseClient";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

const propertySchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  description: z.string().min(3).max(255),
  price: z.coerce.number().min(0),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  postal_code: z.string(),
  type: z.string().optional(),
  home_type: z.string().optional(),
  slug: z.string().optional(),
});

export const createUpdateProperty = async (formData: FormData) => {
  const session = await auth();
  const data = Object.fromEntries(formData.entries());

  const propertyParse = propertySchema.safeParse(data);

  if (!propertyParse.success) {
    console.log(propertyParse.error);
    return {
      ok: false,
      message: "Error al validar los datos",
    };
  }

  const property = propertyParse.data;

  const { id, ...rest } = property;

  if (id) {
    /* Update */
    const resp = await supabase
      .from("properties")
      .update({
        ...rest,
        slug: property.title.toLowerCase().replace(/ /g, "_").trim(),
      })
      .match({ id })
      .select();

    if (resp.error) {
      console.log("error", resp.error.message);
      return {
        ok: false,
        message: "Error al actualizar la propiedad",
      };
    }
    const { data } = resp;

    const res = await checkImagesToUpload(formData, data[0].id);

    if (!res) {
      return {
        ok: false,
        message: "Error al subir las imagenes",
      };
    }

    revalidatePath("/dashboard&create=true");
    revalidatePath(`/dashboard/properties/${data[0].slug}`);

    return {
      ok: true,
      data,
    };
  } else {
    /* Create */
    const user = await supabase
      .from("users")
      .select()
      .eq("email", session?.user?.email as string)
      .single();

    if (!user) {
      return {
        ok: false,
        message: "Error al obtener el usuario",
      };
    }

    const resp = await supabase
      .from("properties")
      .insert({
        address: property.address as string,
        city: property.city as string,
        description: property.description as string,
        home_type: property.home_type as string,
        postal_code: property.postal_code as string,
        price: property.price as number,
        state: property.state as string,
        title: property.title as string,
        type: property.type as string,
        slug: property.title.toLowerCase().replace(/ /g, "_").trim(),
        user_id: user.data?.id,
      })
      .select();

    if (resp.error) {
      console.log("error", resp.error.message);
      return {
        ok: false,
        message: "Error al crear la propiedad",
      };
    }

    const { data } = resp;

    const res = await checkImagesToUpload(formData, data[0].id);

    if (!res) {
      return {
        ok: false,
        message: "Error al subir las imagenes",
      };
    }

    revalidatePath("/dashboard&create=true");
    revalidatePath(`/dashboard/properties/${data[0].slug}`);

    return {
      ok: true,
      data,
    };
  }
};

const checkImagesToUpload = async (formData: FormData, property_id: string) => {
  if (formData.getAll("images")) {
    const images = await uploadImages(formData.getAll("images") as File[]);

    if (!images) {
      throw new Error("error al subir las imagenes");
    }

    const imagesPromises = images.map((image) =>
      supabase
        .from("images")
        .insert({ url: image as string, property_id: property_id })
    );

    await Promise.all(imagesPromises);

    revalidatePath("/dashboard");

    return {
      ok: true,
      message: "Imagenes subidas correctamente",
    };
  } else {
    return {
      ok: false,
      message: "No hay imagenes para subir",
    };
  }
};

const uploadImages = async (images: File[]) => {
  try {
    const uploadPromises = images.map(async (image) => {
      try {
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString("base64");

        return cloudinary.uploader
          .upload(`data:image/png;base64,${base64Image}`)
          .then((res) => res.secure_url);
      } catch (e) {
        console.log(e);
        return null;
      }
    });

    const uploadedImages = await Promise.all(uploadPromises);

    return uploadedImages;
  } catch (error) {
    console.log(error);
    return null;
  }
};
