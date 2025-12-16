"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { ButtonType } from "@/utils/enum/ButtonType";
import { ButtonVariant } from "@/utils/enum/ButtonVariant";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black dark:text-gray-100 px-4">
      <h1 className="text-6xl font-extrabold mb-4">404</h1>
      <p className="text-xl mb-8 text-center">
        Oops! The page you are looking for does not exist.
      </p>
      <Button
        type={ButtonType.BUTTON}
        buttonText="Go Back Home"
        variant={ButtonVariant.PRIMARY}
        onClick={() => router.push("/")}
      />
    </div>
  );
}
