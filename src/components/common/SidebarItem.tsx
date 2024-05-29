"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CiBookmarkCheck } from "react-icons/ci";

interface Props {
  icon: React.ReactNode;
  href: string;
  name: string;
}

export const SidebarItem = ({ icon, href, name }: Props) => {
  const pathName = usePathname();

  {
    /* Active className: text-white bg-gradient-to-r from-sky-600 to-cyan-400 */
  }
  return (
    <li>
      <Link
        href={href}
        className={`
        px-4 py-3 flex items-center space-x-4 rounded-md text-gray-600 group
        hover:bg-gradient-to-r hover:bg-sky-600 hover:text-white
        ${
          href === pathName
            ? "text-white bg-gradient-to-r from-sky-600 to-cyan-400"
            : ""
        }
      `}
      >
        {icon}
        <span className="group-hover:text-white-700">{name}</span>
      </Link>
    </li>
  );
};
