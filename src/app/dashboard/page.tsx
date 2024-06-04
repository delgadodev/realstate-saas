import { getPropertiesByUser } from "@/actions/properties/get-properties-by-user";
import PropertiesGrid from "@/components/dashboard/properties/PropertiesGrid";
import Link from "next/link";

export default async function DashboardPage() {
  const prop = await getPropertiesByUser();

  if (!prop?.ok) {
    return <div>Error obteniendo las propiedades</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Mis propiedades</h1>

        <Link
          className="bg-blue-500 p-2 text-white rounded"
          href="/dashboard/properties/new"
        >
          Agregar propiedad
        </Link>
      </div>

      <PropertiesGrid properties={prop.properties || []} />
    </div>
  );
}
