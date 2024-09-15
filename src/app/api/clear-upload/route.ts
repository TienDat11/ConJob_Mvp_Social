import prisma from "@/lib/prisma";
import { UTApi } from "uploadthing/server";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SERCRET}`) {
      return Response.json(
        { message: "Invalid authorization header" },
        { status: 401 },
      );
    }

    const unusedMedia = await prisma.media.findMany({
      where: {
        postId: null,
        ...(process.env.NODE_ENV === "production"
          ? {
              createdAt: {
                lte: new Date(Date.now() - 1000 * 60 * 60 * 24),
              },
            }
          : {}),
      },
      select: {
        id: true,
        url: true,
      },
    });

    const fileKeys = unusedMedia.map((m) => {
      const key = m.url.split(`/a/${process.env.NEXT_UPLOADTHING_APP_ID}/`)[1];
      console.log('Generated key:', key);
      return key;
    });

    new UTApi().deleteFiles(
      fileKeys  
    ).then(response => {
      console.log('Files deleted successfully:', response);
      // Bạn có thể thêm logic để xử lý sau khi xóa thành công
    })
    .catch(error => {
      console.error('Error deleting files:', error);
      // Bạn có thể xử lý lỗi tại đây
    });

    await prisma.media.deleteMany({
      where: {
        id: {
          in: unusedMedia.map((m) => m.id),
        },
      },
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}