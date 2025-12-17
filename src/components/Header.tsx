import Image from "next/image";
import { User } from "lucide-react";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";

import Logo from "@/components/icons/Logo";
import UserMenu from "@/components/UserMenu";
import { useUser } from "@/customHooks/useUser";
import { useLogout } from "@/customHooks/useLogout";
import { userController } from "@/state/controller/user";
import { todoController } from "@/state/controller/todo";
import { QUERY_KEYS } from "@/utils/constants/QueryKeys";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";

const Header = () => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const pathname = usePathname();
  const isAuthPage =
    pathname === "/auth/login" ||
    pathname === "/auth/signup" ||
    pathname === "/auth/resetPassword/sentEmail" ||
    pathname === "/auth/resetPassword";

  const { data, error } = useUser();
  const { mutate: logout, isPending } = useLogout();

  const [openUserMenu, setOpenUserMenu] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
      return;
    }

    if (!data || isAuthPage) return;

    userController.login(
      data.id,
      data.user_metadata.name,
      data.email,
      data.user_metadata.imageUrl
    );
  }, [data, error, isAuthPage]);

  const handleOpenUserMenu = () => {
    setOpenUserMenu(!openUserMenu);
  };

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        userController.logout();
        todoController.clearTodos();
        queryClient.removeQueries({ queryKey: [QUERY_KEYS.TODOS, data?.id] });
        queryClient.removeQueries({ queryKey: [QUERY_KEYS.USER] });
        router.push("/auth/login");
      },
      onError: () => {
        toast.error(NOTIFY_MESSAGES.LOGOUT_FAILED);
      },
    });
  };

  return (
    <>
      <header className="relative w-full max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center sm:justify-between gap-4 px-4 sm:px-10 py-6 text-white">
        <div className="flex items-center gap-2">
          <Logo />
          <h1 className="text-[1.6rem] sm:text-[2rem] font-bold">TODO</h1>
        </div>

        {data && !isAuthPage && (
          <div className="flex items-center justify-center gap-2 relative">
            <div>{data?.user_metadata?.name}</div>
            <div
              onClick={handleOpenUserMenu}
              className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden cursor-pointer"
            >
              {data?.user_metadata?.imageUrl ? (
                <Image
                  src={data?.user_metadata?.imageUrl}
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
          <UserMenu onLogout={handleLogout} isLoading={isPending} />
        )}
      </header>

      <ToastContainer autoClose={2000} />
    </>
  );
};

export default Header;
