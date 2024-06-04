"use server";

import { auth } from "@/auth";
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

    if (resp.data[0] !== undefined) {
      const { password_hash: _, ...rest } = resp.data[0];
      return {
        ok: true,
        data: rest,
      };
    }
  } catch (e) {
    console.log(e);
    return {
      ok: false,
      message: "Error obteniendo el usuario",
    };
  }
};

export const getUserId = async () => {
  try {
    const session = await auth();

    const resp = await supabase
      .from("users")
      .select()
      .eq("email", session?.user?.email as string);

    if (resp.error) {
      return {
        ok: false,
        message: "Error obteniendo el usuario",
      };
    }
    return {
      ok: true,
      userId: resp.data[0].id,
    };
  } catch (e) {
    console.log(e);
  }
};
