"use server";

import { eq } from "drizzle-orm";
import validator from "validator";

import { db } from "@/db";
import { users } from "@/db/schemas/user";
import { User } from "@/utils/interfaces/User";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { getServerSession } from "@/utils/actions/GetServerSession";

export const signup = async (signupData: User) => {
  try {
    const { supabase } = await getServerSession();

    if (
      !signupData.email ||
      !signupData.password ||
      !signupData.name ||
      !validator.isEmail(signupData.email) ||
      signupData.password.length < 6 ||
      signupData.password !== signupData.confirmPassword
    ) {
      return { success: false, message: NOTIFY_MESSAGES.ALL_FIELDS_REQUIRED };
    }

    const emailExists = await db
      .select()
      .from(users)
      .where(eq(users.email, signupData.email));

    if (emailExists.length > 0) {
      return { success: false, message: NOTIFY_MESSAGES.EMAIL_ALREADY_EXISTS };
    }

    const { data, error } = await supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
      options: {
        data: {
          name: signupData.name,
          imageUrl: "",
        },
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message || NOTIFY_MESSAGES.SIGNUP_FAILED,
      };
    }

    await db.insert(users).values({
      id: data.user?.id,
      name: signupData.name,
      email: signupData.email,
      imageUrl: "",
      createdBy: data.user?.id,
      createdAt: new Date(),
      updatedBy: null,
      updatedAt: null,
      deletedBy: null,
      deletedAt: null,
    });

    return {
      success: true,
      user: data.user,
      message: NOTIFY_MESSAGES.SIGNUP_SUCCESS,
    };
  } catch {
    return { success: false, message: NOTIFY_MESSAGES.SERVER_ERROR };
  }
};
