"use server";

import { supabase } from "@/lib/supabaseClient";

export const getPropertyBySlug = async (slug: string) => {
  try {
    const resp = await supabase.from("properties").select("*").eq("slug", slug);

    console.log("Resp desde action", resp);

    if (resp.data === null || resp.data.length === 0) {
      return {
        ok: false,
        message: "No se encontró la propiedad",
      };
    }

    const property = resp.data[0];

    return {
      ok: true,
      data: property,
    };
  } catch (e) {
    console.log(e);
    return {
      ok: false,
      message: "Error al obtener la propiedad",
    };
  }
};
