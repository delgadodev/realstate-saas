"use client";
import { useUIStore } from "@/store/ui-store";
import clsx from "clsx";
import { CiSearch, CiMenuBurger, CiChat1, CiBellOn } from "react-icons/ci";
import { IoCloseOutline, IoSearchOutline } from "react-icons/io5";
import Link from "next/link";

interface Props {
  links: {
    name: string;
    href: string;
    icon: React.ReactNode;
  }[];
}

export const TopMenu = ({ links }: Props) => {
  const openSideMenu = useUIStore((state) => state.openSideMenu);
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeMenu = useUIStore((state) => state.closeSideMenu);

  return (
    <>
      <div className="sticky z-10 top-0 h-16 border-b bg-white lg:py-2.5">
        <div className="px-6 flex items-center justify-between space-x-4">
          <h2>Dashboard</h2>
          <div>
            <button
              onClick={openSideMenu}
              className="w-12 h-16 -mr-2  lg:hidden"
            >
              <CiMenuBurger size={30} />
            </button>
          </div>
        </div>
      </div>
      <div>
        {/* Background black */}
        {isSideMenuOpen && (
          <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30" />
        )}

        {/* Blur */}
        {isSideMenuOpen && (
          <div
            onClick={closeMenu}
            className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
          />
        )}

        {/* Sidemenu */}
        <nav
          className={clsx(
            "fixed p-5 right-0 top-0 w-[375px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
            {
              "translate-x-full": !isSideMenuOpen,
            }
          )}
        >
          <IoCloseOutline
            size={50}
            className="absolute top-5 right-5 cursor-pointer"
            onClick={() => closeMenu()}
          />

          {/* Input */}
          <div className="relative mt-14">
            <IoSearchOutline size={20} className="absolute top-2 left-2" />
            <input
              type="text"
              placeholder="Buscar"
              className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Menú */}

          <nav>
            <ul className="mt-14 space-y-4">
              {links.map((item) => (
                <div key={item.href} className="flex gap-2 items-center">
                  {item.icon}
                  <Link href={item.href}>{item.name}</Link>
                </div>
              ))}
            </ul>
          </nav>
        </nav>
      </div>
    </>
  );
};
