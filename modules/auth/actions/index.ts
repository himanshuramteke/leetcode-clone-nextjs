"use server";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { User, UserRole } from "@prisma/client";

type OnBoardUserResponse =
  | {
      success: true;
      user: User;
      message: string;
    }
  | {
      success: false;
      error: string;
    };

export const onBoardUser = async (): Promise<OnBoardUserResponse> => {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, error: "No authenticated user found" };
    }

    const { id, firstName, lastName, imageUrl, emailAddresses } = user;

    const newUser = await db.user.upsert({
      where: {
        clerkId: id,
      },
      update: {
        firstName: firstName || null,
        lastName: lastName || null,
        imageUrl: imageUrl || null,
        email: emailAddresses[0]?.emailAddress || "",
      },
      create: {
        clerkId: id,
        firstName: firstName || null,
        lastName: lastName || null,
        imageUrl: imageUrl || null,
        email: emailAddresses[0]?.emailAddress || "",
      },
    });

    return {
      success: true,
      user: newUser,
      message: "User onBoarded successfully",
    };
  } catch (error: unknown) {
    console.log("Error onboarding user", error);
    return {
      success: false,
      error: "Failed to onboard user",
    };
  }
};

export const currentUserRole = async (): Promise<UserRole | undefined> => {
  try {
    const user = await currentUser();

    if (!user) {
      return undefined;
    }

    const { id } = user;
    const userRole = await db.user.findUnique({
      where: {
        clerkId: id,
      },
      select: {
        role: true,
      },
    });

    return userRole?.role;
  } catch (error: unknown) {
    console.log("Error getting currentUserRole", error);
    return undefined;
  }
};
