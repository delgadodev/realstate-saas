"use server";

import { supabase } from "@/lib/supabaseClient";
import { getUserId } from "../user/get-user";

export const getPropertiesByUser = async () => {
  try {
    const resp = await getUserId();

    if (!resp?.ok) {
      return {
        ok: false,
        message: "Error obteniendo el usuario",
      };
    }

    const properties = await supabase
      .from("properties")
      .select()
      .eq("user_id", resp.userId as string);

    if (properties.error) {
      return {
        ok: false,
        message: "Error obteniendo las propiedades",
      };
    }

    /* Obtener de la db las imagenes de las propiedades que tengo */

    const images = await supabase
      .from("images")
      .select("*")
      .in(
        "property_id",
        properties.data.map((p) => p.id)
      );

    if (images.error) {
      return {
        ok: false,
        message: "Error obteniendo las imagenes",
      };
    }

    const propertiesWithImages = properties.data.map((p) => {
      return {
        ...p,
        images: images.data.filter((i) => i.property_id === p.id),
      };
    });

    return {
      ok: true,
      properties: propertiesWithImages,
    };
  } catch (e) {
    console.log(e);
  }
};
