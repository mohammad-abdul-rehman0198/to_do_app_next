"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast, ToastContainer } from "react-toastify";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { User } from "@/utils/interfaces/User";
import { ButtonType } from "@/utils/enum/ButtonType";
import { userController } from "@/state/controller/user";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { LoginSchema } from "@/utils/validationSchemas/LoginSchema";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(LoginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: User) => {
    try {
      await userController.login(data);
    } catch {
      toast.error(NOTIFY_MESSAGES.LOGIN_FAILED);
    }
  };

  return (
    <div className="flex flex-col">
      <section className="grow flex items-start justify-center">
        <div className="w-[90%] max-w-[420px] rounded-[11px] p-6  border border-[#c2b39a]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <h1 className="text-white text-2xl text-center">Log In</h1>

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

            <div className="flex justify-end">
              <Link
                href="/auth/resetPassword/sentEmail"
                className="text-blue-500 text-sm text-center hover:underline"
              >
                Reset Password?
              </Link>
            </div>

            <Button
              buttonText={isSubmitting ? "Logging In..." : "Log In"}
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

        <ToastContainer />
      </section>
    </div>
  );
};

export default Login;
