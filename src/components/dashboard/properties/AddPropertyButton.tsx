"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  userPlan: string;
  propertiesLength: number;
}

const plans: { [key: string]: number } = {
  FREE: 1,
  PREMIUM: 3,
  INMOBILIRIA: 10000,
};

export default function AddPropertyButton({
  userPlan,
  propertiesLength,
}: Props) {
  /* Desabilitar el boton si el userPlan o la cantidad de propiedades es igual o superior */
  if (propertiesLength >= plans[userPlan]) {
    return (
      <Button disabled>
        <Link href="/dashboard/properties/new">Agregar propiedad</Link>
      </Button>
    );
  }

  return (
    <Button>
      <Link href="/dashboard/properties/new">Agregar propiedad</Link>
    </Button>
  );
}
