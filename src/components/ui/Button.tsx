"use client";

import Loader from "@/components/Loader";
import type { ButtonProps } from "@/utils/interfaces/ButtonProps";

const Button = ({ buttonText, logo, isLoading, isDisable }: ButtonProps) => {
  return (
    <button
      type="submit"
      disabled={isDisable || isLoading}
      className="bg-[#88ab33] border-none cursor-pointer rounded-[11px] py-3 px-2 flex items-center justify-center"
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>

          {logo && (
            <span className="w-full h-full flex items-center justify-center">
              {logo}
            </span>
          )}

          {buttonText && (
            <span className="text-white text-[1rem]">{buttonText}</span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
