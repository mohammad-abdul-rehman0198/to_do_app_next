"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast, ToastContainer } from "react-toastify";

import Header from "@/components/Header";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { User } from "@/utils/interfaces/User";
import { ButtonType } from "@/utils/enum/ButtonType";
import { userController } from "@/state/controller/user";
import { ButtonVariant } from "@/utils/enum/ButtonVariant";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { ResetPasswordEmailSchema } from "@/utils/validationSchemas/ResetPasswordEmailSchema";

const ResetPasswordEmail = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(ResetPasswordEmailSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: User) => {
    try {
      await userController.resetPasswordEmail(data.email || "");
    } catch {
      toast.error(NOTIFY_MESSAGES.PASSWORD_RESET_EMAIL_NOT_SENT);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="h-full grow flex items-start justify-center">
        <div className="w-[90%] max-w-[420px] rounded-[11px] p-6 border border-[#c2b39a]">
          <Button
            variant={ButtonVariant.ICON}
            logo={<ArrowLeft />}
            onClick={() => router.back()}
            className="invert"
          />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <h1 className="text-white text-2xl text-center">Reset Password</h1>
            <p className="text-white text-sm text-center">
              Enter your email and we&apos;ll send you a link to reset your
              password.
            </p>
            <div>
              <Input
                label="Email*"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className={errors.email ? "border border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              buttonText={isSubmitting ? "Sending..." : "Send Reset Email"}
              type={ButtonType.SUBMIT}
              isLoading={isSubmitting}
              isDisable={!isValid || isSubmitting}
            />

            <p className="text-white text-sm text-center">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-blue-500 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>

        <ToastContainer autoClose={2000} />
      </section>
    </div>
  );
};

export default ResetPasswordEmail;
