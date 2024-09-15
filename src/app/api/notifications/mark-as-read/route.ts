import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export async function PATCH() {
  try {
    const { user } = await validateRequest();

    if(!user) return Response.json({error: "Unauthorized"}, {status: 401});

    await prisma.notification.updateMany({
      where: {
        recipientId: user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({error: "Sever Internal Error"}, {status: 500});
  }
}