"use server";

import { supabase } from "@/lib/supabaseClient";
import { getImagesFromId } from "./get-images-from-id";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

export const deleteProperty = async (id: string) => {
  try {
    const images = await getImagesFromId(id);

    if (images?.images) {
      images.images.forEach(async (image) => {
        const imageName = image.url.split("/").pop()?.split(".")[0] ?? "";
        const [images, imagesDb] = await Promise.all([
          cloudinary.uploader.destroy(imageName),
          supabase.from("images").delete().eq("id", image.id),
        ]);

        if (images.result === "not found") {
          throw new Error("Image not found in cloudinary");
        }

        if (imagesDb.error) {
          throw new Error("Error deleting image from database");
        }
      });
    }

    await supabase.from("properties").delete().eq("id", id);

    revalidatePath("/dashboard");
    return {
      ok: true,
      message: "Property deleted",
    };
  } catch (e) {
    return {
      ok: false,
      message: "Error deleting property",
    };
  }
};
