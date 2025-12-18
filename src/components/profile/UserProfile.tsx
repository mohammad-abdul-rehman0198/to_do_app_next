"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast, ToastContainer } from "react-toastify";
import { User as UserIcon, ArrowLeft, X } from "lucide-react";

import Input from "@/components/ui/Input";
import Edit from "@/components/icons/Edit";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { User } from "@/utils/interfaces/User";
import { ButtonType } from "@/utils/enum/ButtonType";
import { userController } from "@/state/controller/user";
import { ButtonVariant } from "@/utils/enum/ButtonVariant";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { ProfileFormSchema } from "@/utils/validationSchemas/ProfileFormSchema";

const UserProfile = () => {
  const router = useRouter();

  const { user } = userController.useState(["user"]);

  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
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
    if (user?.name) {
      reset({ name: user.name });
    }
  }, [user, reset]);

  const toggleEditName = () => {
    if (isEditing) {
      reset({ name: user?.name || "" });
      setProfileImage(null);
    } else {
      setFocus("name");
    }
    setIsEditing(!isEditing);
  };

  const onSubmit = async (data: User) => {
    try {
      await userController.updateUser(data, profileImage as File);
      setIsEditing(false);
    } catch {
      toast.error(NOTIFY_MESSAGES.PROFILE_UPDATE_FAILED);
    }
  };

  return (
    <>
      <div className="flex justify-center bg-black px-4">
        <div className="relative w-full max-w-md  p-6 rounded-2xl shadow-lg border border-[#c2b39a] ">
          <div className="flex items-center justify-between">
            <Button
              variant={ButtonVariant.ICON}
              logo={<ArrowLeft />}
              onClick={() => router.push("/")}
              className="invert"
            />
            {isEditing ? (
              <X
                className="cursor-pointer text-red-500"
                onClick={toggleEditName}
              />
            ) : (
              <Button
                variant={ButtonVariant.ICON}
                onClick={toggleEditName}
                logo={<Edit />}
              />
            )}
          </div>

          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
            User Profile
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-5 w-full"
          >
            <div className="w-32 h-32 relative rounded-full overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-700">
              {isSubmitting ? (
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
              ) : user?.imageUrl ? (
                <Image
                  src={user?.imageUrl || ""}
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
            {isEditing && (
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
            )}

            <div className="w-full relative">
              <Input
                label="Name:"
                {...register("name")}
                readOnly={!isEditing}
                className={`${!isEditing && "bg-transparent"}`}
              />
            </div>

            <Input
              label="Email:"
              disabled
              value={user?.email || ""}
              readOnly
              className={`${!isEditing ? "bg-transparent" : "opacity-50 cursor-not-allowed"}`}
            />

            {isEditing && (
              <Button
                type={ButtonType.SUBMIT}
                buttonText={isSubmitting ? "Updating..." : "Update Profile"}
                isLoading={isSubmitting}
                isDisable={!isValid || isSubmitting || !hasChanges}
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
