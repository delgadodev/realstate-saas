import { getUserByEmail } from "@/actions/user/get-user";
import { auth } from "@/auth";
import { Sidebar } from "@/components/common/Sidebar";
import { TopMenu } from "@/components/common/Topmenu";
import { redirect } from "next/navigation";
import { IconType } from "react-icons";
import { FaHome } from "react-icons/fa";
import { Fa0, FaCreditCard, FaHouse, FaPerson } from "react-icons/fa6";

export default async function DashboradLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const resp = await getUserByEmail(session?.user?.email as string);

  if (!session) {
    redirect("/login");
  }

  const links = [
    { name: "Inicio", href: "/dashboard", icon: <FaHouse /> },
    { name: "Mi perfil", href: "/dashboard/profile", icon: <FaPerson /> },
    {
      name: "Plan de suscripción",
      href: "/dashboard/suscripcion",
      icon: <FaCreditCard />,
    },
  ];

  console.log(resp?.data);

  return (
    <>
      <Sidebar
        links={links}
        data={
          resp?.data as {
            avatar: string | null;
            created_at: string | null;
            email: string;
            id: string;
            role: string;
            updated_at: string | null;
            username: string;
          }
        }
      />

      {/* Main Layout content - Contenido principal del Layout */}
      <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%] min-h-screen">
        {/* TODO: Contenido en el Layout.tsx */}
        <TopMenu links={links} />
        <div className="px-6 pt-6">{children}</div>
      </div>
    </>
  );
}
