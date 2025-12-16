import { toast } from "react-toastify";
import { supabase } from "@/db/supabase/client";
import { useMutation } from "@tanstack/react-query";

import { API_METHODS } from "@/utils/enum/ApiMethods";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { API_END_POINTS, HEADERS } from "@/utils/constants/apis/Index";

interface UpdateProfilePayload {
  name: string;
  profileImage?: File | null;
  imageUrl?: string | null;
}

export const useUpdateProfile = () => {
  

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async ({ name, profileImage, imageUrl }: UpdateProfilePayload) => {
      if (profileImage) {
        const fileExt = profileImage.name.split(".").pop();
        const fileName = `user_${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("profile-images")
          .upload(fileName, profileImage, { cacheControl: "0", upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("profile-images")
          .getPublicUrl(uploadData.path);

        imageUrl = publicUrlData.publicUrl;
      }

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + API_END_POINTS.USERS_PROFILE,
        {
          method: API_METHODS.PUT,
          headers: HEADERS,
          body: JSON.stringify({ name, imageUrl }),
        }
      );

      if (!response.ok) throw new Error(NOTIFY_MESSAGES.PROFILE_UPDATE_FAILED);

      return await response.json();
    },
    onError: (error: Error) => {
      toast.error(error?.message || NOTIFY_MESSAGES.PROFILE_UPDATE_FAILED);
    },
  });

  return { mutate, isPending, isError, isSuccess };
};
