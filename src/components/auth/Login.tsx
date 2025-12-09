"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { User } from "@/utils/interfaces/User";
import { ButtonType } from "@/utils/enum/ButtonType";
import { API_METHODS } from "@/utils/enum/ApiMethods";
import { LoginSchema } from "@/utils/validationSchemas/LoginSchema";
import { API_END_POINTS, HEADERS } from "@/utils/constants/apis/Index";


const Login = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(LoginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: User) => {
    try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + API_END_POINTS.USERS_LOGIN,
          {
            method: API_METHODS.POST,
            headers: HEADERS,
            body: JSON.stringify(data),
          }
        );
  
        if (!response.ok) {
          toast.error("Failed to login");
          return;
        }
  
        const responseData = await response.json();
        if (responseData.success) {
          toast.success(responseData.message);
          router.push("/");
        } else {
          toast.error(responseData.message);
        }
      } catch {
        toast.error("Failed to login");
      } finally {
        reset();
      }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-[90%] max-w-[420px] rounded-[11px] p-6 bg-[#111827]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <h1 className="text-white text-2xl text-center">Login</h1>

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

          <Button
            buttonText={isSubmitting ? "Logging in..." : "Login"}
            type={ButtonType.SUBMIT}
            isLoading={isSubmitting}
            isDisable={!isValid || isSubmitting}
          />

          <p className="text-white text-sm text-center">
            Don&apos;t have an account? <Link href="/auth/signup" className="text-blue-500 hover:underline" >Sign up</Link>
          </p>
        </form>
      </div>

      <ToastContainer />
    </section>
  );
};

export default Login;
