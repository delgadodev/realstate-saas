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
import { Image, Property } from "@/lib/supabaseClient";
import Link from "next/link";

type PropertyWithImages = Property & {
  images: Image[];
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
                <img
                  src={property.images[0]?.url}
                  alt={property.title}
                  className="w-[80px] h-[80px] object-cover"
                />
              </TableCell>
              <TableCell>{property.title}</TableCell>
              <TableCell>{property.price}</TableCell>
              <TableCell>{property.description}</TableCell>
              <TableCell>{property.type}</TableCell>
              <TableCell className="flex gap-5 items-center justify-center ">
                <Link
                  className="text-blue-500 hover:underline "
                  href={`/dashboard/properties/${property.slug}`}
                >
                  Editar
                </Link>

                <Button
                  onClick={() => {
                    // deleteProductImage(property.images[0].url, property.images[0].id);
                  }}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
