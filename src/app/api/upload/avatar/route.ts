import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { uploadToBlob, generateAvatarPath } from "@/lib/blob/upload";
import { deleteByURL } from "@/lib/blob/delete";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }


    console.log('Avatar upload attempt:', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      userId: user.id,
    });


    if (user.avatarUrl) {
      await deleteByURL(user.avatarUrl);
    }


    const path = generateAvatarPath(user.id);
    const blob = await uploadToBlob(file, path, 30 * 24 * 60 * 60);
    const url = blob.url;


    await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: url },
    });

    console.log('Avatar uploaded successfully:', { userId: user.id, url });

    return Response.json({ avatarUrl: url });
  } catch (error) {
    console.error("Avatar upload error:", error);


    if (error instanceof Error) {
      if (error.message.includes('Validation failed')) {
        return Response.json(
          { error: error.message },
          { status: 400 }
        );
      }
      if (error.message.includes('Unauthorized')) {
        return Response.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    return Response.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
