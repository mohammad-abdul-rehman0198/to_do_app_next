"use client";

import Link from "next/link";
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
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { SignupSchema } from "@/utils/validationSchemas/SignupSchema";

const Signup = () => {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(SignupSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: User) => {
    try {
      await userController.signup(data, router);
    } catch {
      toast.error(NOTIFY_MESSAGES.SIGNUP_FAILED);
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
            <h1 className="text-white text-2xl text-center">Sign Up</h1>
            <div>
              <Input
                label="Name*"
                type="text"
                placeholder="Enter your name"
                {...register("name")}
                className={errors.name ? "border border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

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
              buttonText={isSubmitting ? "Signing up..." : "Sign Up"}
              type={ButtonType.SUBMIT}
              isLoading={isSubmitting }
              isDisable={!isValid || isSubmitting }
            />

            <p className="text-white text-sm text-center">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-blue-500 hover:underline"
              >
                Log In
              </Link>
            </p>
          </form>
        </div>

        <ToastContainer />
      </section>
    </div>
  );
};

export default Signup;
