"use client";

import { loginCredentials } from "@/actions/auth/login";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const googleLogin = async () => {
    try {
      const resp = await signIn("google");

      if (resp?.ok) {
        router.push("/dashboard");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loginWithCredentials = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await loginCredentials(email, password);
      router.push("/dashboard");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={loginWithCredentials}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>

      <button type="button" onClick={googleLogin}>
        Login with Google
      </button>
    </div>
  );
}
