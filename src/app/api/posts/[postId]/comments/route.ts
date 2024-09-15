import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { CommentPage, getCommentDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, 
  {params: {postId}} : {params: {postId: string}}
) {
  try {
    const {user: loggedInUser} = await validateRequest();

    const cursor = req.nextUrl.searchParams.get("cursor") ?? undefined;

    if(!loggedInUser) return Response.json({error: "Unauthorized"},{status: 401});

    const pageSize = 5;

    const comments = await prisma.comment.findMany({
      where: {postId},
      include: getCommentDataInclude(loggedInUser.id),
      orderBy: {createdAt: "asc"},
      take: -pageSize - 1,
      cursor: cursor ? {id: cursor} : undefined,
    });

    const previousCursor = comments.length > pageSize ? comments[0].id : null;

    const data: CommentPage = {
      comments: comments.length > pageSize ? comments.slice(1) : comments,
      previousCursor
    };

    return  Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({error: "Internal Sever Error"}, {status: 500});
  }
}