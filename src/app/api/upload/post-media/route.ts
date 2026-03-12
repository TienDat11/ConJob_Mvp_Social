import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { uploadToBlob, generatePostImagePath, generatePostVideoPath } from "@/lib/blob/upload";
import { FILE_SIZE_LIMITS } from "@/lib/blob/validation";
import { MediaType } from "@prisma/client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return Response.json({ error: "No files provided" }, { status: 400 });
    }

    if (files.length > 5) {
      return Response.json(
        { error: "Maximum 5 files allowed per upload" },
        { status: 400 },
      );
    }


    const imageCount = files.filter((f) => f.type.startsWith("image/")).length;
    const videoCount = files.filter((f) => f.type.startsWith("video/")).length;

    if (videoCount > 1) {
      return Response.json(
        { error: "Only 1 video allowed per post" },
        { status: 400 },
      );
    }

    if (videoCount > 0 && imageCount > 0) {
      return Response.json(
        { error: "Cannot mix images and videos in the same post" },
        { status: 400 },
      );
    }

    console.log("[post-media] Upload attempt:", {
      userId: user.id,
      fileCount: files.length,
      imageCount,
      videoCount,
      fileNames: files.map((f) => f.name),
    });


    const tempPostId = crypto.randomUUID();


    const mediaResults = await Promise.all(
      files.map(async (file) => {
        const isVideo = file.type.startsWith("video/");
        const maxSize = isVideo
          ? FILE_SIZE_LIMITS.POST_VIDEO
          : FILE_SIZE_LIMITS.POST_IMAGE;


        const cacheTTL = 90 * 24 * 60 * 60;


        const path = isVideo
          ? generatePostVideoPath(tempPostId)
          : generatePostImagePath(tempPostId, 0);


        const blob = await uploadToBlob(file, path, cacheTTL);


        const mediaType: MediaType = isVideo ? "VIDEO" : "IMAGE";


        const media = await prisma.media.create({
          data: {
            type: mediaType,
            url: blob.url,
          },
        });

        console.log("[post-media] Media created:", {
          mediaId: media.id,
          type: mediaType,
          url: blob.url,
        });

        return {
          id: media.id,
          type: mediaType,
          url: blob.url,
        };
      }),
    );

    return Response.json({
      media: mediaResults,
    });
  } catch (error) {
    console.error("[post-media] Upload error:", error);


    if (error instanceof Error) {
      if (error.message.includes("Validation failed")) {
        return Response.json(
          { error: error.message },
          { status: 400 },
        );
      }
      if (error.message.includes("Unauthorized")) {
        return Response.json(
          { error: "Unauthorized" },
          { status: 401 },
        );
      }
      if (error.message.includes("size")) {
        return Response.json(
          { error: "File too large. Images max 5MB, videos max 50MB" },
          { status: 400 },
        );
      }
    }

    return Response.json(
      { error: "Upload failed. Please try again." },
      { status: 500 },
    );
  }
}
