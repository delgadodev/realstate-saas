"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Image as TypeImage, Property } from "@/lib/supabaseClient";
import Link from "next/link";
import { AlertDialoG } from "@/components/common/AlertDialog";
import Image from "next/image";

type PropertyWithImages = Property & {
  images: TypeImage[];
};

interface Props {
  properties: PropertyWithImages[];
}

export default function PropertiesGrid({ properties }: Props) {
  return (
    <div className="border shadow-sm rounded-lg mt-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Imagen</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Descripcion</TableHead>
            <TableHead>Tipo de transaccion </TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property.id}>
              <TableCell>
                <Image
                  src={
                    property.images[0]?.url || "/default-img/defaulthouse.jpg"
                  }
                  width={400}
                  height={400}
                  alt={property.title}
                  className="w-full object-cover"
                />
              </TableCell>
              <TableCell>{property.title}</TableCell>
              <TableCell>{property.price}</TableCell>
              <TableCell>{property.description}</TableCell>
              <TableCell className="capitalize">{property.type}</TableCell>
              <TableCell className="flex gap-5 items-center justify-center ">
                <Button>
                  <Link href={`/dashboard/properties/${property.slug}`}>
                    Editar
                  </Link>
                </Button>

                <AlertDialoG propertyId={property.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
