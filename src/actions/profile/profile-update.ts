"use server";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabaseClient";
import { z } from "zod";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

const profileSchema = z.object({
  name: z.string().min(3).max(155),
  description: z.string().min(3).max(900),
  phone: z.string().min(3).max(20).optional(),
  emailContact: z.string().email().optional(),
  image: z
    .instanceof(File)
    .refine((file) => file.type.startsWith("image/"), {
      message: "El archivo debe ser una imagen",
    })
    .optional(),
});

export const updateProfile = async (formData: FormData) => {
  const session = await auth();

  if (!session) {
    return {
      ok: false,
      message: "Usuario no autenticado",
    };
  }

  const data = Object.fromEntries(formData.entries());

  const profile = profileSchema.safeParse(data);
  if (!profile.success) {
    return {
      ok: false,
      message: profile.error.errors.map((e) => e.message).join(", "),
    };
  }

  let imageUrl = null;

  // Obtener la URL de la imagen antigua del usuario desde Supabase
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("avatar")
    .eq("email", session.user?.email ?? "")
    .single();

  if (userError) {
    console.error(userError);
    return {
      ok: false,
      message: "Error al obtener datos del usuario",
    };
  }

  if (formData.get("image")) {
    const avatar: File = formData.get("image") as File;

    try {
      const buffer = await avatar.arrayBuffer();
      const base64String = Buffer.from(buffer).toString("base64");

      // Eliminar la imagen antigua de Cloudinary si existe
      if (
        userData.avatar &&
        !userData.avatar.includes("googleusercontent.com")
      ) {
        const publicId = userData.avatar.split("/").pop()?.split(".")[0] ?? "";
        await cloudinary.uploader.destroy("user_avatars/" + publicId);
      }

      // Subir la nueva imagen a Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(
        `data:${avatar.type};base64,${base64String}`,
        {
          folder: "user_avatars",
        }
      );

      imageUrl = uploadResponse.secure_url;
    } catch (e) {
      console.error(e);
      return {
        ok: false,
        message: "Error al subir la imagen",
      };
    }
  }

  try {
    const updateData = {
      username: profile.data.name,
      description: profile.data.description,
      phone: profile.data.phone,
      emailContact: profile.data.emailContact,
      avatar: userData.avatar,
    };

    if (imageUrl) {
      updateData.avatar = imageUrl;
    }

    const resp = await supabase
      .from("users")
      .update({
        username: updateData.username,
        description: updateData.description,
        phone: updateData.phone,
        contact_email: updateData.emailContact,
        avatar: updateData.avatar,
      })
      .eq("email", session.user?.email as string);

    if (resp.error) {
      console.log("error", resp.error.message);
      return {
        ok: false,
        message: "Error al actualizar el perfil",
      };
    }

    revalidatePath("/dashboard/profile");
    return {
      ok: true,
      message: "Perfil actualizado correctamente",
    };
  } catch (e) {
    console.error(e);
    return {
      ok: false,
      message: "Error al actualizar el perfil",
    };
  }
};
