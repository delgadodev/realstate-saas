"use server";

import { supabase } from "@/lib/supabaseClient";
import { ok } from "assert";

export const getUserByEmail = async (email: string) => {
  try {
    const resp = await supabase.from("users").select().eq("email", email);

    if (resp.error) {
      return {
        ok: false,
        message: "Error obteniendo el usuario",
      };
    }

    const { password_hash: _, ...rest } = resp.data[0];

    return {
      ok: true,
      data: rest,
    };
  } catch (e) {
    console.log(e);
    return {
      ok: false,
      message: "Error obteniendo el usuario",
    };
  }
};
