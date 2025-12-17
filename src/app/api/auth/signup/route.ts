import { eq } from "drizzle-orm";
import validator from "validator";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { users } from "@/db/schemas/user";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { getServerSession } from "@/utils/actions/GetServerSession";


export const POST = async (req: Request) => {
  try {
    const { email, password, name, confirmPassword } = await req.json();

    const { supabase } = await getServerSession();

    if (!email || !password || !name || !validator.isEmail(email) || password.length < 6 || password !== confirmPassword) {
      return NextResponse.json({
        success: false,
        message: NOTIFY_MESSAGES.ALL_FIELDS_REQUIRED,
      });
    }

    const emailExists = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (emailExists.length > 0) {
      return NextResponse.json({
        success: false,
        message: NOTIFY_MESSAGES.EMAIL_ALREADY_EXISTS,
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          imageUrl: "",
        },
      },
    });

    if (error) {
      return NextResponse.json({
        success: false,
        message: error?.message || NOTIFY_MESSAGES.SIGNUP_FAILED,
      });
    }

    await db.insert(users).values({
      id: data.user?.id,
      name,
      email,
      imageUrl: "",
      createdBy: data.user?.id,
      createdAt: new Date(),
      updatedBy: null,
      updatedAt: null,
      deletedBy: null,
      deletedAt: null,
    });

    return NextResponse.json({
      success: true,
      user: data,
      message: NOTIFY_MESSAGES.SIGNUP_SUCCESS,
    });
  } catch  {
    return NextResponse.json({ success: false, message: NOTIFY_MESSAGES.SERVER_ERROR });
  }
};
