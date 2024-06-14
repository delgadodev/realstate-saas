"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { User } from "@/lib/supabaseClient";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { updateProfile } from "@/actions/profile/profile-update";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

type userWithoutPassword = Omit<User, "password_hash">;

interface Props {
  user?: userWithoutPassword;
}

interface FormInputs {
  name: string;
  description: string;
  phone?: string;
  emailContact?: string;
  image?: Blob;
}

export default function ProfileForm({ user }: Props) {
  const [onAddedPhoto, setOnAddedPhoto] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
    getValues,
    setValue,
  } = useForm<FormInputs>({
    defaultValues: {
      name: user?.username,
      description: user?.description || "",
      phone: user?.phone || "",
      emailContact: user?.contact_email || "",
      image: undefined,
    },
  });

  const { toast } = useToast();

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData();

    if (data.image) {
      formData.append("image", data.image);
    }

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("phone", data.phone || "");
    formData.append("emailContact", data.emailContact || "");

    try {
      const resp = await updateProfile(formData);

      if (resp.ok) {
        toast({
          title: "Perfil actualizado",
          description: "Tu perfil ha sido actualizado correctamente",
          variant: "success",
        });
      } else {
        console.log("error", resp.message);
        toast({
          title: "Error al actualizar el perfil",
          description: "Ha ocurrido un error al actualizar tu perfil",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      const reader = new FileReader();
      reader.onload = () => {
        setOnAddedPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden">
          <Image
            src={
              onAddedPhoto || user?.avatar || "/default-img/defaultavatar.webp"
            }
            alt="Avatar"
            className="w-full h-full object-cover"
            width={300}
            height={128}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer transition-opacity duration-300 opacity-0 hover:opacity-100">
            <CameraIcon className="w-8 h-8 text-white" />
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml, image/avif"
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">{user?.username}</h1>
          <p className="text-gray-500 text-2xl dark:text-gray-400">
            {user?.role}
          </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            {user?.email}
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              type="text"
              {...register("name", { required: true })}
              defaultValue={user?.username}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Telefono de contacto</Label>
            <Input
              id="name"
              type="tel"
              placeholder="*Telefono de contacto"
              {...register("phone", {
                pattern: /^[0-9]{8,14}$/,
              })}
              defaultValue={user?.phone || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Email de contacto</Label>
            <Input
              id="name"
              type="email"
              placeholder="*Email de contacto"
              {...register("emailContact")}
              defaultValue={user?.contact_email || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripcion</Label>
            <Textarea
              id="description"
              rows={9}
              placeholder="*Breve descripcion sobre ti o tu empresa"
              {...register("description")}
              defaultValue={user?.description || ""}
            />
          </div>

          {errors.phone && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">
              {errors.phone?.type === "pattern" && "El telefono no es valido"}
            </div>
          )}

          <Button type="submit" className="w-full">
            Guardar cambios
          </Button>
        </form>
      </div>
    </div>
  );
}

function CameraIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}
