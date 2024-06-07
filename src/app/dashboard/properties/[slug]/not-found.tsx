import Image from "next/image";
import Link from "next/link";



export default function NotFoundPage() {
  return (
    <div className="h-screen grid justify-center">
      <div className="w-[500px] mx-auto">
        <Image
          src="/404.jpg"
          alt="404"
          width={1280}
          height={720}
          className="w-full"
        />
        <h1 className="text-5xl font-bold text-center">
          No se encontro la propiedad
        </h1>

        <Link
          href="/dashboard"
          className="bg-blue-500 text-white text-center py-2 px-4 rounded-full mt-8 block w-full "
        >
          <p>Volver a mis propiedades</p>
        </Link>
      </div>
    </div>
  );
}
