import { Prisma } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import { ResumeValues } from "./validation";

export function getUserDataSelect(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    createdAt: true,
    followers: {
      where: {
        followerId: loggedInUserId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        posts: true,
        followers: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>

export function getFeedUserSelect(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    followers: {
      where: {
        followerId: loggedInUserId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        followers: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export function getPostDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
    attachments: true,
    likes: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    bookmarks: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    _count: {
      select: {
        likes: true,
        comments: true, 
      },
    },
  } satisfies Prisma.PostInclude;
}

export function getFeedPostSelect(loggedInUserId: string) {
  return {
    id: true,
    content: true,
    createdAt: true,
    user: {
      select: getFeedUserSelect(loggedInUserId),
    },
    attachments: {
      select: {
        id: true,
        url: true,
        type: true,
      },
    },
    likes: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    bookmarks: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
  } satisfies Prisma.PostSelect;
}


export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export type FeedPostData = Prisma.PostGetPayload<{
  select: ReturnType<typeof getFeedPostSelect>;
}>;

export interface PostsPage {
  posts: FeedPostData[];
  nextCursor: string | null;
}

export function getCommentDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
  } satisfies Prisma.CommentInclude;
}

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;

export interface CommentPage {
  comments: CommentData[];
  previousCursor: string | null;
} 

export const notificationsSelect = {
  id: true,
  type: true,
  read: true,
  postId: true,
  issuer: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
  post: {
    select: {
      content: true,
    },
  },
} satisfies Prisma.NotificationSelect

export type NotificationData = Prisma.NotificationGetPayload<{select:typeof notificationsSelect}>

export interface NotificationPage {
  notifications: NotificationData[];
  nextCursor: string | null;
}

export interface FollowerInfo {
  followers: number,
  isFollowerByUser: boolean,
}

export interface LikeInfo {
  likes: number;
  isLikedByUser: boolean;
}

export interface BookmarkInfo {
  isBookmarkInfo: boolean;
}

export interface NotificationCountInfo {
  unreadCount: number;
}

export interface MessageCountInfo {
  unreadCount: number;
}

export interface HeaderUnreadStateInfo {
  notifications: number;
  messages: number;
}

export interface ValuesNameChat {
  nameChat: string;
}

export interface EditorFormProps {
  resumeData: ResumeValues;
  setResumeData: Dispatch<SetStateAction<ResumeValues>>;
}

export const resumeDataInclude = {
  workExperiences: true,
  educations: true,
} satisfies Prisma.ResumeInclude;

export type ResumeServerData = Prisma.ResumeGetPayload<{
  include: typeof resumeDataInclude;
}>;
