import Image from "next/image";
import { User } from "lucide-react";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useRouter, usePathname } from "next/navigation";

import Logo from "@/components/icons/Logo";
import UserMenu from "@/components/UserMenu";
import { userController } from "@/state/controller/user";

const Header = () => {
  const router = useRouter();

  const pathname = usePathname();
  const isAuthPage =
    pathname === "/auth/login" ||
    pathname === "/auth/signup" ||
    pathname === "/auth/resetPassword/sentEmail" ||
    pathname === "/auth/resetPassword";

  const [isLoading, setIsLoading] = useState(false);
  const userData = userController.useState(["user"]);

  const [openUserMenu, setOpenUserMenu] = useState(false);

  useEffect(() => {
    if (!userData || isAuthPage) return;
  }, [userData, isAuthPage]);

  const handleOpenUserMenu = () => {
    setOpenUserMenu(!openUserMenu);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await userController.clearUser();
    setIsLoading(false);
    router.push("/auth/login");
  };

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

        {userData && !isAuthPage && (
          <div className="flex items-center gap-3 relative">
            <div className="hidden sm:block">{userData?.user?.name}</div>

            <div
              onClick={handleOpenUserMenu}
              className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden cursor-pointer"
            >
              {userData?.user?.imageUrl ? (
                <Image
                  src={userData?.user?.imageUrl}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
          </div>
        )}

        {openUserMenu && !isAuthPage && (
          <UserMenu onLogout={handleLogout} isLoading={isLoading} />
        )}
      </header>

      <ToastContainer autoClose={2000} />
    </>
  );
};

export default Header;
