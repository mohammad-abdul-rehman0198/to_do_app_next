"use client";

import Link from "next/link";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast, ToastContainer } from "react-toastify";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { User } from "@/utils/interfaces/User";
import { ButtonType } from "@/utils/enum/ButtonType";
import { userController } from "@/state/controller/user";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { ResetPasswordSchema } from "@/utils/validationSchemas/ResetPasswordSchema";

const ForgotPassword = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const setSession = async () => {
      const hash = window.location.hash;
      if (!hash) return router.push("/auth/login");

      const params = new URLSearchParams(hash.slice(1));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      const type = params.get("type");

      if (type !== "recovery" || !access_token || !refresh_token) {
        return router.push("/auth/login");
      }

      Cookies.set("sb-access-token", access_token || "", { expires: 1 });
      Cookies.set("sb-refresh-token", refresh_token || "", { expires: 1 });
    };

    setSession();
  }, [router]);

  const onSubmit = async (data: User) => {
    try {
      await userController.resetPassword(data, router);
    } catch {
      toast.error(NOTIFY_MESSAGES.PASSWORD_RESET_FAILED);
    }
  };

  return (
    <div className="lex flex-col">
      <section className="grow flex items-start justify-center">
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

export default ForgotPassword;
