"use client";
import { deletePropertyImage } from "@/actions/properties/delete-image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Image as ImageType } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Props {
  images: ImageType[];
}

export default function CarouselImages({ images }: Props) {
  const [deleteLoading, setDeleteLoading] = useState<boolean | string>(false);
  const handleDeleteImage = async (imageUrl: string, imageId: string) => {
    try {
      setDeleteLoading(imageId);

      await deletePropertyImage(imageUrl, imageId);

      setDeleteLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Carousel>
      <CarouselContent>
        {images?.map((image) => (
          <CarouselItem key={image.id}>
            <Image
              src={image.url}
              alt={image.url}
              width={1280}
              height={720}
              className="rounded-t-md w-full h-[500px]  object-cover"
            />
            <button
              onClick={() => handleDeleteImage(image.url, image.id)}
              type="button"
              disabled={deleteLoading as boolean}
              className="bg-red-500 p-2 text-white font-semibold w-full rounded-b-xl flex items-center justify-center gap-2"
            >
              {deleteLoading === image.id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Eliminando
                </>
              ) : (
                "Eliminar"
              )}
            </button>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious type="button" />
      <CarouselNext type="button" />
    </Carousel>
  );
}
