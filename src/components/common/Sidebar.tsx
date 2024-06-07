"use client";
import Image from "next/image";
import Link from "next/link";
import { CiLogout } from "react-icons/ci";

import {
  IoCalendarOutline,
  IoCheckboxOutline,
  IoListOutline,
} from "react-icons/io5";
import { SidebarItem } from "./SidebarItem";
import { IconType } from "react-icons";
import React from "react";
import { User } from "@/lib/supabaseClient";
import { signOut } from "next-auth/react";

interface Props {
  links: {
    name: string;
    href: string;
    icon: React.ReactNode;
  }[];

  data: {
    avatar: string | null;
    created_at: string | null;
    email: string;
    id: string;
    role: string;
    updated_at: string | null;
    username: string;
  };
}

export const Sidebar = ({ links, data }: Props) => {
  return (
    <aside className="ml-[-100%] fixed z-10 top-0 pb-3 px-6 w-full flex flex-col justify-between h-screen border-r bg-white transition duration-300 md:w-4/12 lg:ml-0 lg:w-[25%] xl:w-[20%] 2xl:w-[15%]">
      <div>
        <div className="-mx-6 px-6 py-4">
          {/* TODO: Next/Link hacia dashboard */}
          <Link href="#" title="home">
            {/* Next/Image */}
            {/* <Image
              src="https://tailus.io/sources/blocks/stats-cards/preview/images/logo.svg"
              className="w-32"
              alt="tailus logo"
              width={150}
              height={150}
            /> */}
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Image
            src={data.avatar || "/default-img/defaultavatar.webp"}
            width={150}
            height={150}
            alt=""
            className="w-10 h-10 m-auto rounded-full object-cover lg:w-28 lg:h-28"
          />
          <h5 className="hidden mt-4 text-xl font-semibold text-gray-600 lg:block">
            {data.username}
          </h5>
          <span className="hidden text-gray-400 lg:block">{data.role}</span>
        </div>

        <ul className="space-y-2 tracking-wide mt-8">
          {links.map((item) => (
            <SidebarItem key={item.href} {...item} />
          ))}
        </ul>
      </div>

      <div className="px-6 -mx-6 pt-4 flex justify-between items-center border-t">
        <button
          onClick={() => signOut()}
          className="px-4 py-3 flex items-center space-x-4 rounded-md text-red-600 group"
        >
          <CiLogout />
          <span className="text-red-500">Cerrar sesion</span>
        </button>
      </div>
    </aside>
  );
};
