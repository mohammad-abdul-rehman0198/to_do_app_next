"use server";

import { redirect } from "next/navigation";

import { getUser } from "../actions/auth/user";
import UserProfile from "@/components/UserProfile";
import JotaiProvider from "@/utils/providers/JotaiProvider";

export default async function Profile() {
  const userData = await getUser();

  if (!userData) {
    redirect("/auth/login");
  }
  
  return <JotaiProvider>
    <UserProfile userData={userData || null} />
  </JotaiProvider>;
 }