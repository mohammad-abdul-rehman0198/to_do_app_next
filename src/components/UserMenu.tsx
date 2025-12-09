"use client";

import { LogOut } from "lucide-react";

import Button from "@/components/ui/Button";
import { ButtonType } from "@/utils/enum/ButtonType";
import { ButtonVariant } from "@/utils/enum/ButtonVariant";

interface UserMenuProps {
  email: string;
  onLogout: () => void;
  isLoading: boolean;
}

const UserMenu = ({ email, onLogout, isLoading }: UserMenuProps) => {
  return (
    <div
      className="absolute top-16 right-0 w-[220px] flex flex-col gap-3 
  bg-[#111827] border border-gray-700 rounded-[14px] 
  shadow-xl p-4 z-50"
    >
      <span className="max-w-full truncate text-sm text-gray-300 border-b border-gray-700 pb-2">
        {email}
      </span>

      <Button
        type={ButtonType.BUTTON}
        variant={ButtonVariant.PRIMARY}
        buttonText="Logout"
        onClick={onLogout}
        logo={<LogOut className="w-4 h-4" />}
        isLoading={isLoading}
        isDisable={isLoading}
      />
    </div>
  );
};

export default UserMenu;
