"use client";

import clsx from "clsx";

import Loader from "@/components/ui/Loader";
import { ButtonType } from "@/utils/enum/ButtonType";
import { ButtonVariant } from "@/utils/enum/ButtonVariant";

interface ButtonProps {
  buttonText?: string;
  logo?: React.ReactNode;
  isLoading?: boolean;
  isDisable?: boolean;
  variant?: ButtonVariant;
  bgColor?: string;
  type?: ButtonType;
  className?: string;
  onClick?: () => void;
}

const Button = ({
  buttonText,
  logo,
  isLoading,
  isDisable,
  onClick,
  variant = ButtonVariant.PRIMARY,
  bgColor,
  className,
  type = ButtonType.SUBMIT,
}: ButtonProps) => {
  const variantClasses = clsx({
    "bg-[#88ab33] text-white": variant === ButtonVariant.PRIMARY,
    "bg-gray-700 text-white": variant === ButtonVariant.SECONDARY,
    "border border-gray-500 text-gray-700 bg-transparent":
      variant === ButtonVariant.OUTLINE,
    "bg-transparent": variant === ButtonVariant.ICON,
    "bg-transparent text-blue-500 p-0": variant === ButtonVariant.TEXT,
  });

  const customBG = bgColor ? `${bgColor} text-white` : "";
  const paddingClasses =
    variant === ButtonVariant.ICON || variant === ButtonVariant.TEXT
      ? "p-0"
      : "py-3 px-3";

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <button
      type={type === ButtonType.SUBMIT ? "submit" : "button"}
      onClick={handleClick}
      disabled={isDisable || isLoading}
      className={clsx(
        "rounded-[11px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        className,
        paddingClasses,
        variantClasses,
        customBG
      )}
    >
      {logo && <span className="flex items-center justify-center">{logo}</span>}

      {buttonText && variant !== ButtonVariant.ICON && (
        <span className="text-[1rem]">{buttonText}</span>
      )}

      {isLoading && (
        <span className="ml-2 flex items-center">
          <Loader />
        </span>
      )}
    </button>
  );
};

export default Button;
