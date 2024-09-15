"use client"

import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface FollowerCountProps{
  userId: string;
  initialState: FollowerInfo;
}

export default function FollowerCount({userId, initialState: initialState}: FollowerCountProps) {
  const {data} = useFollowerInfo(userId,initialState);

  return <span>
    Follower:{" "}
  <span className="font-semibold">
    {formatNumber(data.followers)}
  </span>
  </span>
}
