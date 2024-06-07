"use client";
import { Image as TypeImage, Property } from "@/lib/supabaseClient";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { createUpdateProperty } from "@/actions/properties/create-update-property";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import localidades from "@/localidades.json";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import CarouselImages from "./Carousel";

interface Props {
  property: Partial<Property>;
  title: string;
  images?: TypeImage[];
}

interface FormInputs {
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  type?: string;
  slug?: string;
  home_type?: string;
  images?: FileList;
}

export default function PropertyForm({ property, title, images }: Props) {
  const {
    handleSubmit,
    register,
    formState: { isValid },
    getValues,
    setValue,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      title: property.title ?? "",
      description: property.description ?? "",
      price: property.price ?? 0,
      address: property.address ?? "",
      city: property.city ?? "",
      state: property.state ?? "",
      postal_code: property.postal_code ?? "",
      type: property.type ?? "",
      home_type: property.home_type ?? "",
      slug: property.slug ?? "",
      images: undefined,
    },
  });

  const router = useRouter();
  const [createdUpdated, setCreatedUpdated] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData();

    const { images, ...propertyToSave } = data;

    if (property.id) {
      formData.append("id", property.id ?? "");
    }
    formData.append("title", propertyToSave.title);
    formData.append("description", propertyToSave.description);
    formData.append("price", propertyToSave.price.toString());
    formData.append("address", propertyToSave.address);
    formData.append("city", propertyToSave.city);
    formData.append("state", propertyToSave.state);
    formData.append("type", propertyToSave.type ?? "");
    formData.append("home_type", propertyToSave.home_type ?? "");
    formData.append("postal_code", propertyToSave.postal_code);
    formData.append(
      "slug",
      propertyToSave.title.toLowerCase().replace(" ", "-")
    );

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    }
    setLoading(true);
    try {
      const { ok, data: updatedProperty } = await createUpdateProperty(
        formData
      );

      if (!ok) {
        alert("Error al guardar la propiedad");
        return;
      }
      setLoading(false);
      setCreatedUpdated(true);
    } catch (e) {
      console.error(e);
    }
  };

  if (createdUpdated) {
    setTimeout(() => {
      router.push("/dashboard");
    }, 700);
  }

  return (
    <>
      <AlertDialog open={createdUpdated}>
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Propiedad guardada correctamente
            </AlertDialogTitle>
            <AlertDialogDescription>
              La propiedad ha sido guardada correctamente, puedes verla en la
              lista de propiedades
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      <div className={clsx(createdUpdated && "hidden", "flex")}>
        <div className="w-full">
          <Link
            href="/dashboard"
            className="flex gap-2 items-center font-semibold"
          >
            <IoArrowBack size={25} />
            Atras
          </Link>
          <div>
            <h1 className="text-4xl font-bold mt-2 py-2">{title}</h1>
            <p className="text-gray-500 mb-10">
              Rellena el formulario para enlistar tu propiedad
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-lg" htmlFor="title">
                    Titulo
                  </Label>
                  <Input
                    id="title"
                    placeholder="Ingresa un titulo"
                    {...register("title", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-lg" htmlFor="description">
                    Descripcion
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property"
                    {...register("description", { required: true })}
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-lg" htmlFor="price">
                    Precio
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter the price"
                    {...register("price", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-lg" htmlFor="address">
                    Direccion
                  </Label>
                  <Input
                    id="address"
                    placeholder="Enter the address"
                    {...register("address", { required: true })}
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-lg" htmlFor="city">
                    Departamento
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      setValue("city", value);
                    }}
                    defaultValue={property.city ?? ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {localidades.departamentos.map((departamento) => (
                        <SelectItem key={departamento} value={departamento}>
                          {departamento}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-lg" htmlFor="state">
                    Localidad
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      setValue("state", value);
                    }}
                    defaultValue={property.state ?? ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la localidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {localidades.localidades.map((localidad) => (
                        <SelectItem key={localidad} value={localidad}>
                          {localidad}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-lg" htmlFor="postalCode">
                    Codigo Postal
                  </Label>
                  <Input
                    id="postalCode"
                    placeholder="Enter the postal code"
                    {...register("postal_code", { required: true })}
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-lg" htmlFor="type">
                    Tipo de transaccion
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      setValue("type", value);
                    }}
                    defaultValue={property.type ?? ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo de transaccion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="venta">Venta</SelectItem>
                      <SelectItem value="alquiler">Alquiler</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-lg" htmlFor="home-type">
                    Tipo de inmueble
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      setValue("home_type", value);
                    }}
                    defaultValue={property.home_type ?? ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo de inmueble" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="departamento">Departamento</SelectItem>
                      <SelectItem value="casaQuinta">Casa Quinta</SelectItem>
                      <SelectItem value="oficinas">Oficinas</SelectItem>
                      <SelectItem value="local">Local</SelectItem>
                      <SelectItem value="estacionamiento">
                        Estacionamiento
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-lg" htmlFor="images">
                  Images
                </Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  {...register("images")}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml, image/avif"
                />
              </div>

              <div className="lg:w-[60%] h-[500px] p-12">
                <CarouselImages images={images ?? []} />
              </div>
              <div className="mt-24">
                <Button
                  disabled={loading}
                  type="submit"
                  className="
                p-6
                "
                >
                  {loading ? "Guardando" : "Guardar"}
                  {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
