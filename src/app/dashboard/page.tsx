export const dynamic = "force-dynamic";

import { getPropertiesByUser } from "@/actions/properties/get-properties-by-user";
import { getUserPlan } from "@/actions/user/get-user";
import AddPropertyButton from "@/components/dashboard/properties/AddPropertyButton";
import PropertiesGrid from "@/components/dashboard/properties/PropertiesGrid";

export const metadata = {
  title: "Dashboard | Inicio",
  description: "Dashboard",
};

export default async function DashboardPage() {
  const prop = await getPropertiesByUser();
  const userPlan = await getUserPlan();

  if (!prop?.ok) {
    return <div>Error obteniendo las propiedades</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Mis propiedades</h1>
        <AddPropertyButton
          propertiesLength={prop.properties?.length ?? 0}
          userPlan={userPlan?.plan ?? ""}
        />
      </div>

      <PropertiesGrid properties={prop.properties ?? []} />
    </div>
  );
}
