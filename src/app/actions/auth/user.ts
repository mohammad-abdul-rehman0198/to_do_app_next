import { User } from "@/utils/interfaces/User";
import { getServerSession } from "@/utils/actions/GetServerSession";


export const getUser = async () => {
  const { supabase } = await getServerSession();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    return null;
  }

  const userData: User = {
    id: user.id,
    name: user.user_metadata?.name ?? "",
    email: user.email ?? "",
    imageUrl: user.user_metadata?.imageUrl ?? "",
  };

  return userData;
};
