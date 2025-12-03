import Image from "next/image";

import Loader from "@/components/Loader";
import addIcon from "@/assets/icons/add.svg";
import type { ButtonProps } from "@/utils/interfaces/ButtonProps";

const Button = ({ isValid, isSubmitting }: ButtonProps) => {
  return (
    <button
      type="submit"
      disabled={!isValid || isSubmitting}
      className=" bg-[#88ab33] border-none cursor-pointer rounded-[11px] py-3 px-2  flex items-center justify-center"
    >
      {isSubmitting ? (
        <Loader />
      ) : (
        <Image src={addIcon} alt="add" className="w-full h-full" />
      )}
    </button>
  );
};

export default Button;
