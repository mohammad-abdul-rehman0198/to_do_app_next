"use client";

import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { StateController } from "jotai-controller";

import { supabase } from "@/db/supabase/client";
import { login } from "@/app/actions/auth/login";
import { signup } from "@/app/actions/auth/signup";
import { logout } from "@/app/actions/auth/logout";
import type { User } from "@/utils/interfaces/User";
import { getCookies } from "@/utils/actions/GetCookies";
import { todoController } from "@/state/controller/todo";
import { sentEmail } from "@/app/actions/auth/sentEmail";
import { updateProfile } from "@/app/actions/profile/profile";
import { resetPassword } from "@/app/actions/auth/resetPassword";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";

interface UserState {
  user: User;
}
class UserController extends StateController<Partial<UserState>> {
  constructor() {
    super("user", {
      user: undefined,
    });

    this.autoSubscribeOnMethods(this);
  }

  setUser(user: User) {
    this.setState({
      user: user,
    });
  }

  async updateUser(updateProfileData: User, profileImage?: File) {
    try {
      if (profileImage) {
        const cookies = await getCookies();
        const cookiesArray = cookies.split("; ");

        let accessToken = "";
        let refreshToken = "";

        cookiesArray.forEach((cookie) => {
          const [name, value] = cookie.split("=");
          if (name === "sb-access-token") accessToken = value;
          if (name === "sb-refresh-token") refreshToken = value;
        });

        const fileExt = profileImage.name.split(".").pop();
        const fileName = `user_${Date.now()}.${fileExt}`;
       
        const { error: setSessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (setSessionError) throw setSessionError;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("profile-images")
          .upload(fileName, profileImage, { cacheControl: "0", upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("profile-images")
          .getPublicUrl(uploadData.path);

        updateProfileData.imageUrl = publicUrlData.publicUrl;
      }

      const {
        success,
        user: updatedUser,
        message,
      } = await updateProfile(updateProfileData);
      if (success) {
        toast.success(message || NOTIFY_MESSAGES.PROFILE_UPDATED_SUCCESS);
        this.setState({
          user: updatedUser,
        });
      } else {
        toast.error(message || NOTIFY_MESSAGES.PROFILE_UPDATE_FAILED);
      }
    } catch (error) {
      toast.error((error as Error).message || NOTIFY_MESSAGES.SERVER_ERROR);
    }
  }

  async signup(user: User, router: ReturnType<typeof useRouter>) {
    const { success, message } = await signup(user);
    if (success) {
      toast.success(message);
      router.push("/auth/login");
    } else {
      toast.error(message);
    }
  }

  async login(user: User) {
    const { success, message } = await login(user);
    if (success) {
      window.location.replace('/');
      toast.success(message);
    } else { 
      toast.error(message);
    }
  }

  async resetPasswordEmail(email: string) {
    const { success, message } = await sentEmail(email);
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  }

  async resetPassword(
    resetPasswordData: User,
    router: ReturnType<typeof useRouter>
  ) {
    const { success, message } = await resetPassword(resetPasswordData);
    if (success) {
      toast.success(message);
      router.push("/auth/login");
    } else {
      toast.error(message);
    }
  }

  async clearUser() {
    const { success, message } = await logout();
    if (success) {
      toast.success(message);
      todoController.clearTodos();
      this.setState({
        user: undefined,
      });
    } else {
      toast.error(message);
    }
  }
}

export const userController = new UserController();
