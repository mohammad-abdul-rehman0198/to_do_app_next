"use client";

import Image from "next/image";
import { useState } from "react";
import { User } from "lucide-react";
import { ToastContainer } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";

import Logo from "@/components/icons/Logo";
import UserMenu from "@/components/profile/UserMenu";
import { userController } from "@/state/controller/user";

const Header = () => {
  const router = useRouter();

  const userData = userController.useState(["user"]);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const pathname = usePathname();
  const isAuthPage =
    pathname === "/auth/login" ||
    pathname === "/auth/signup" ||
    pathname === "/auth/resetPassword/sentEmail" ||
    pathname === "/auth/resetPassword";

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full md:max-w-[70%] mx-auto
  flex flex-row items-center justify-between 
  px-4 sm:px-10 py-6 text-white bg-black border-none"
      >
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Logo />
          <h1 className="text-[1.6rem] sm:text-[2rem] font-bold">TODO</h1>
        </div>

        {userData && (
          <div className="flex items-center gap-3 relative">
            {!isAuthPage && (
              <div className="hidden sm:block">{userData?.user?.name}</div>
            )}

            <div
              onClick={() => setOpenUserMenu((v) => !v)}
              className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden cursor-pointer"
            >
              {userData?.user &&
                !isAuthPage &&
                (userData.user.imageUrl ? (
                  <Image
                    src={userData.user.imageUrl}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <User className="w-6 h-6 text-white" />
                ))}
            </div>
          </div>
        )}

        {openUserMenu && <UserMenu onClose={() => setOpenUserMenu(false)} />}
      </header>

      <ToastContainer autoClose={2000} />
    </>
  );
};

export default Header;
