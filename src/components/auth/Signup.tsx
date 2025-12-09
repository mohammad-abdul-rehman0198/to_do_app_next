"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast, ToastContainer } from "react-toastify";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { User } from "@/utils/interfaces/User";
import { ButtonType } from "@/utils/enum/ButtonType";
import { API_METHODS } from "@/utils/enum/ApiMethods";
import { SignupSchema } from "@/utils/validationSchemas/SignupSchema";
import { API_END_POINTS, HEADERS } from "@/utils/constants/apis/Index";

const Signup = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(SignupSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: User) => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + API_END_POINTS.USERS_SIGNUP,
        {
          method: API_METHODS.POST,
          headers: HEADERS,
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        toast.error("Failed to sign up");
        return;
      }

      const responseData = await response.json();
      if (responseData.success) {
        toast.success(responseData.message);
        router.push("/auth/login");
      } else {
        toast.error(responseData.message);
      }
    } catch {
      toast.error("Failed to sign up");
    } finally {
      reset();
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-[90%] max-w-[420px] border rounded-[11px] p-6 bg-[#111827]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <h1 className="text-white text-2xl text-center">Sign Up</h1>
          <div>
            <Input
              type="text"
              placeholder="Name*"
              {...register("name")}
              className={errors.name ? "border border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Input
              type="email"
              placeholder="Email*"
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
              type="password"
              placeholder="Password*"
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
              type="password"
              placeholder="Confirm Password*"
              {...register("confirmPassword")}
              className={errors.confirmPassword ? "border border-red-500" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            buttonText={isSubmitting ? "Creating..." : "Create Account"}
            type={ButtonType.SUBMIT}
            isLoading={isSubmitting}
            isDisable={!isValid || isSubmitting}
          />

          <p className="text-white text-sm text-center">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>

      <ToastContainer />
    </section>
  );
};

export default Signup;
