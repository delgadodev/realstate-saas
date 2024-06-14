import { getUserByEmail } from "@/actions/user/get-user";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileForm from "./ui/ProfileForm";

export const metadata = {
  title: "Dashboard | Perfil",
  description: "Dashboard",
};

export default async function ProfilePage() {
  const session = await auth();
  const resp = await getUserByEmail(session?.user?.email as string);

  return (
    <div className="text-4xl font-bold">
      <h1>Mi perfil</h1>
      <ProfileForm user={resp?.data ?? undefined} />
    </div>
  );
}
