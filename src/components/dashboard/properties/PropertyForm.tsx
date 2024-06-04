"use client";
import { Image as TypeImage, Property } from "@/lib/supabaseClient";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
import Image from "next/image";
import { deletePropertyImage } from "@/actions/properties/delete-image";

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

    const { ok, data: updatedProperty } = await createUpdateProperty(formData);

    if (!ok) {
      alert("Error al guardar la propiedad");
      return;
    }

    router.replace("/dashboard");
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            Rellena el formulario para enlistar tu propiedad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titulo</Label>
                <Input
                  id="title"
                  placeholder="Ingresa un titulo"
                  {...register("title", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripcion</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property"
                  {...register("description", { required: true })}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Enter the price"
                  {...register("price", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Direccion</Label>
                <Input
                  id="address"
                  placeholder="Enter the address"
                  {...register("address", { required: true })}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  placeholder="Enter the city"
                  {...register("city", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Localidad</Label>
                <Input
                  id="state"
                  placeholder="Enter the state"
                  {...register("state", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Codigo Postal</Label>
                <Input
                  id="postalCode"
                  placeholder="Enter the postal code"
                  {...register("postal_code", { required: true })}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de transaccion</Label>
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
                <Label htmlFor="home-type">Tipo de inmueble</Label>
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
              <Label htmlFor="images">Images</Label>
              <Input
                id="images"
                type="file"
                multiple
                {...register("images")}
                accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml, image/avif"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {images?.map((image) => (
                <div key={image.id}>
                  <Image
                    src={image.url}
                    width={200}
                    height={200}
                    alt={image?.id ?? ""}
                    className="rounded-t-md shadow-md 
                    object-cover w-full h-44

                    "
                  />
                  <button
                    onClick={() => deletePropertyImage(image.url, image.id)}
                    type="button"
                    className="bg-red-500 p-2 text-white font-semibold w-full rounded-b-xl"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
            <CardFooter>
              <Button type="submit" className="ml-auto">
                {title === "Nueva propiedad" ? "Crear" : "Actualizar"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
