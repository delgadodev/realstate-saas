"use server";

import { supabase } from "@/lib/supabaseClient";

export const getImagesFromId = async (propertyId: string) => {
  try {
    const images = await supabase
      .from("images")
      .select("*")
      .eq("property_id", propertyId);

    if (images.error) {
      return {
        ok: false,
        message: "Error obteniendo las imagenes",
      };
    }

    return {
      ok: true,
      images: images.data,
    };
  } catch (e) {
    console.log(e);
  }
};
