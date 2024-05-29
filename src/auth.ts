import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { supabase } from "./lib/supabaseClient";
import bcryptjs from "bcryptjs";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const user = await supabase
          .from("users")
          .select()
          .eq("email", email as string)
          .single();

        if (!user) {
          return null;
        }

        if (
          !bcryptjs.compareSync(
            password as string,
            user.data?.password_hash as string
          )
        )
          return null;

        return user.data;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const { email, name } = user;

        // Chequear si el usuario ya existe en la base de datos
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", email as string);

        if (error) {
          console.error("Error checking if user exists:", error);
          return false;
        }

        if (data.length === 0) {
          // Si el usuario no existe, insertarlo en la base de datos
          const { error } = await supabase.from("users").insert([
            {
              email: profile?.email as string,
              username: profile?.name as string,
              password_hash: "oauth",
              avatar: profile?.picture as string,
            },
          ]);

          if (error) {
            console.error("Error inserting user:", error);
            return false;
          }
        }
      }
      return true;
    },
  },
});
