"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast, ToastContainer } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { User as UserIcon, ArrowLeft, Edit2, X } from "lucide-react";

import Header from "@/components/Header";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { User } from "@/utils/interfaces/User";
import { useUser } from "@/customHooks/useUser";
import { ButtonType } from "@/utils/enum/ButtonType";
import { QUERY_KEYS } from "@/utils/constants/QueryKeys";
import { ButtonVariant } from "@/utils/enum/ButtonVariant";
import { useUpdateProfile } from "@/customHooks/useUpdateProfile";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { ProfileFormSchema } from "@/utils/validationSchemas/ProfileFormSchema";

const UserProfile = () => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: user } = useUser();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const [hasChanges, setHasChanges] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isValid, isDirty, isSubmitting },
    reset,
    setFocus,
  } = useForm({
    resolver: yupResolver(ProfileFormSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const updateHasChanges = () => {
      setHasChanges(isDirty || !!profileImage);
    };
    updateHasChanges();
  }, [isDirty, profileImage]);

  useEffect(() => {
    if (user?.user_metadata?.name) {
      reset({ name: user.user_metadata.name });
    }
  }, [user, reset]);

  const toggleEditName = () => {
    if (isEditingName) {
      reset({ name: user?.user_metadata?.name || "" });
    } else {
      setFocus("name");
    }
    setIsEditingName(!isEditingName);
  };

  const onSubmit = async (data: User) => {
    try {
      updateProfile(
        {
          name: data?.name || "",
          profileImage,
          imageUrl: user?.user_metadata?.imageUrl || null,
        },
        {
          onSuccess: (data) => {
            if (data.success) {
              console.log("old",user);
              queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
              console.log("new",user);
              toast.success(data.message);
              setIsEditingName(false);
              setHasChanges(false);
              setProfileImage(null);
            }
          },
        }
      );
    } catch {
      toast.error(NOTIFY_MESSAGES.PROFILE_UPDATE_FAILED);
    }
  };

  return (
    <>
      <Header />
      <div className="flex justify-center bg-black px-4">
        <div className="relative w-full max-w-md  p-6 rounded-2xl shadow-lg border border-[#c2b39a] ">
          <Button
            variant={ButtonVariant.ICON}
            logo={<ArrowLeft />}
            onClick={() => router.back()}
            className="invert"
          />

          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
            User Profile
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-5 w-full"
          >
            <div className="w-32 h-32 relative rounded-full overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-700">
              {isUpdating ? (
                <Loader />
              ) : profileImage ? (
                <Image
                  src={URL.createObjectURL(profileImage)}
                  alt="Profile"
                  fill
                  sizes="128px"
                  loading="eager"
                  className="object-cover"
                />
              ) : user?.user_metadata?.imageUrl ? (
                <Image
                  src={user?.user_metadata?.imageUrl || ""}
                  alt="Profile"
                  fill
                  sizes="128px"
                  loading="eager"
                  className="object-cover"
                />
              ) : (
                <UserIcon className="w-16 h-16 text-gray-400" />
              )}
            </div>

            <label className="cursor-pointer text-sm text-blue-500 hover:underline">
              Change Profile Image
              <Input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && setProfileImage(e.target.files[0])
                }
              />
            </label>

            <div className="w-full relative">
              <Input
                label="Name:"
                {...register("name")}
                readOnly={!isEditingName}
                className="bg-transparent"
              />
              {isEditingName ? (
                <X
                  className="absolute right-3 top-[38px] w-5 h-5 cursor-pointer text-red-500"
                  onClick={toggleEditName}
                />
              ) : (
                <Edit2
                  className="absolute right-3 top-[38px] w-5 h-5 cursor-pointer text-[#c2b39a]"
                  onClick={toggleEditName}
                />
              )}
            </div>

            <Input
              label="Email:"
              value={user?.email || ""}
              readOnly
              className="bg-transparent"
            />

            {hasChanges && (
              <Button
                type={ButtonType.SUBMIT}
                buttonText={isSubmitting ? "Updating..." : "Update Profile"}
                isLoading={isSubmitting || isUpdating}
                isDisable={!isValid || isSubmitting || isUpdating}
                variant={ButtonVariant.PRIMARY}
              />
            )}
          </form>

          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default UserProfile;
