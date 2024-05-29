"use server";

import { signIn } from "@/auth";

export const loginCredentials = async (email: string, password: string) => {
  try {
    await signIn("credentials", {
      email,
      password,
    });

    return {
      ok: true,
    };
  } catch (e) {
    console.error(e);
    return {
      ok: false,
      message: "No se pudo iniciar sesión. Por favor, intenta de nuevo.",
    };
  }
};
