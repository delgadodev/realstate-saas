import { auth } from "@/auth";

export const metadata = {
  title: "Dashboard | Perfil",
  description: "Dashboard",
};

export default async function ProfilePage() {
  const session = await auth();

  console.log(session);

  return (
    <div>
      <h1>{JSON.stringify({ session })}</h1>
    </div>
  );
}
