"use server";

import { supabase } from "@/lib/supabaseClient";
import bcryptjs from "bcryptjs";

export const createNewUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const newUser = await supabase.from("users").insert([
      {
        username,
        email,
        password_hash: bcryptjs.hashSync(password, 10),
      },
    ]);

    if (newUser.error) {
      throw new Error(newUser.error.message);
    }

    return {
      ok: true,
      newUser: newUser,
    };
  } catch (e) {
    console.error(e);
    return {
      ok: false,
      message: "Error al crear el usuario",
    };
  }
};
