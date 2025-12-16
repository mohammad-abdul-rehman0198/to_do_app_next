"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast, ToastContainer } from "react-toastify";
import { useSearchParams, useRouter } from "next/navigation";

import Header from "@/components/Header";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { User } from "@/utils/interfaces/User";
import { supabase } from "@/db/supabase/client";
import { ButtonType } from "@/utils/enum/ButtonType";
import { useResetPassword } from "@/customHooks/useResetPassword";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { ResetPasswordSchema } from "@/utils/validationSchemas/ResetPasswordSchema";

const ForgotPassword = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const { mutate: resetPassword, isPending: isResettingPassword } =
    useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const exchangeSession = async () => {
      if (!code) {
        return;
      }
      await supabase.auth.exchangeCodeForSession(window.location.href);
    };

    exchangeSession();
  }, [code]);

  const onSubmit = async (data: User) => {
    try {
      resetPassword(data, {
        onSuccess: async () => {
          await supabase.auth.signOut();
          router.push("/auth/login");
        },
      });
    } catch {
      toast.error(NOTIFY_MESSAGES.PASSWORD_RESET_FAILED);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="h-full grow flex items-start justify-center">
        <div className="w-[90%] max-w-[420px] rounded-[11px] p-6 border border-[#c2b39a]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <h1 className="text-white text-2xl text-center">New Password</h1>

            <div>
              <Input
                label="Password*"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                className={errors.password ? "border border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Input
                label="Confirm Password*"
                type="password"
                placeholder="Enter your confirm password"
                {...register("confirmPassword")}
                className={
                  errors.confirmPassword ? "border border-red-500" : ""
                }
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              buttonText={isSubmitting ? "Resetting..." : "Reset Password"}
              type={ButtonType.SUBMIT}
              isLoading={isSubmitting || isResettingPassword}
              isDisable={!isValid || isSubmitting || isResettingPassword}
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

export default ForgotPassword;
