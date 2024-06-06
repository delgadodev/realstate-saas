"use server";

import { supabase } from "@/lib/supabaseClient";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

export const deletePropertyImage = async (
  imageUrl: string,
  imageId: string
) => {
  if (!imageUrl.startsWith("http"))
    return { ok: false, error: "No se pueden borrar imagenes de filesistem" };

  const imageName = imageUrl.split("/").pop()?.split(".")[0] ?? "";

  try {
    await cloudinary.uploader.destroy(imageName);

    const deletedImage = await supabase
      .from("images")
      .delete()
      .eq("id", imageId);

    revalidatePath(`/dashboard`);

    if (deletedImage.error) {
      return { ok: false, error: "Error al borrar imagen" };
    }

    return { ok: true, deletedImage };
  } catch (e) {
    console.log(e);
    return { ok: false, error: "Error al borrar imagen" };
  }
};
