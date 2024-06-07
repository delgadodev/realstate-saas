export const dynamic = "force-dynamic";

import { getImagesFromId } from "@/actions/properties/get-images-from-id";
import { getPropertyBySlug } from "@/actions/properties/get-property-by-slug";
import PropertyForm from "@/components/dashboard/properties/PropertyForm";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Dashboard | Propiedad",
  description: "Dashboard",
};

interface Props {
  params: {
    slug: string;
  };
}

export default async function NewOrEditPropertiePage({ params }: Props) {
  const { slug } = params;

  const property = await getPropertyBySlug(slug);

  if (!property.ok && slug !== "new") {
    notFound();
  }

  const images = await getImagesFromId(property.data?.id ?? "");

  const title = slug === "new" ? "Nueva propiedad" : "Editar propiedad";

  return (
    <div>
      <PropertyForm
        title={title}
        property={property.data ?? {}}
        images={images?.images}
      />
    </div>
  );
}
