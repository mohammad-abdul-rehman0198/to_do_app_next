"use client";

import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import { ButtonType } from "@/utils/enum/ButtonType";
import { ButtonVariant } from "@/utils/enum/ButtonVariant";

interface UserMenuProps {
  isLoading: boolean;
  onLogout: () => void;
}

const UserMenu = ({ onLogout, isLoading }: UserMenuProps) => {
  const router = useRouter();

  return (
    <div
      className="absolute top-18 right-4  max-md:top-32 w-[220px] flex flex-col gap-3 
  bg-[#111827] border border-gray-700 rounded-[14px] 
  shadow-xl p-4 z-50"
    >
      <Button
        type={ButtonType.BUTTON}
        variant={ButtonVariant.TEXT}
        buttonText="Profile"
        onClick={() => router.push("/profile")}
        logo={<User className="w-4 h-4" />}
        className="text-white font-semibold hover:bg-gray-700 px-2 py-2 flex items-center justify-start"
      />

      <hr className="border-gray-700" />

      <Button
        type={ButtonType.BUTTON}
        variant={ButtonVariant.TEXT}
        buttonText="Logout"
        onClick={onLogout}
        logo={<LogOut className="w-4 h-4" />}
        isLoading={isLoading}
        isDisable={isLoading}
        className="text-white font-semibold hover:bg-gray-700 px-2 py-2 flex items-center justify-start"
      />
    </div>
  );
};

export default UserMenu;
