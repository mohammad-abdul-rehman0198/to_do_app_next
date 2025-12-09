import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

import Logo from "@/components/icons/Logo";
import Button from "@/components/ui/Button";
import UserMenu from "@/components/UserMenu";
import { User } from "@/utils/interfaces/User";
import { getUser } from "@/utils/actions/GetUser";
import { ButtonType } from "@/utils/enum/ButtonType";
import { API_METHODS } from "@/utils/enum/ApiMethods";
import { ButtonVariant } from "@/utils/enum/ButtonVariant";
import { API_END_POINTS, HEADERS } from "@/utils/constants/apis/Index";


const Header = () => {
  const router = useRouter();

  const [userData, setUserData] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getUser();

      if (!user) {
        toast.error(user);
        return;
      }

      setUserData({
        id: user?.id,
        name: user?.user_metadata?.name,
        email: user?.email,
      });
    };
    fetchUserData();
  }, []);

  const handleOpenUserMenu = () => {
    setOpenUserMenu(!openUserMenu);
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + API_END_POINTS.USERS_LOGOUT,
        {
          method: API_METHODS.POST,
          headers: HEADERS,
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error("Failed to logout");
        return;
      }

      const responseData = await response.json();
      if (responseData.success) {
        toast.success(responseData.message);
        router.push("/auth/login");
      } else {
        toast.error(responseData.message);
      }
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <>
      <header className="relative w-full max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center sm:justify-between gap-4 px-4 sm:px-10 py-6 text-white">
        <div className="flex items-center gap-2">
          <Logo />
          <h1 className="text-[1.6rem] sm:text-[2rem] font-bold">TODO</h1>
        </div>

        <div className="text-center sm:text-right flex items-center gap-2">
          <h1 className="text-[1.1rem] sm:text-[1.5rem] font-bold">
            Welcome, {userData?.name}
          </h1>

          <Button
            variant={ButtonVariant.ICON}
            logo={<ChevronDown className="w-4 h-4" />}
            onClick={handleOpenUserMenu}
            type={ButtonType.BUTTON}
          />
        </div>

        {openUserMenu && (
          <UserMenu
            email={userData?.email || ""}
            onLogout={handleLogout}
            isLoading={isLoading}
          />
        )}
      </header>

      <ToastContainer autoClose={2000} />
    </>
  );
};

export default Header;
