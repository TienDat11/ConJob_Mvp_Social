"use client"

import { FollowerInfo } from "@/lib/types";
import { useToast } from "./ui/use-toast";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import kyInstance from "@/lib/ky";
import useFollowerInfo from "@/hooks/useFollowerInfo";

interface FollowerButtonProps {
  userId: string;
  initialState: FollowerInfo;
} 

export default function FollowerButton({ userId, initialState } : FollowerButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();


  const { data } = useFollowerInfo(userId, initialState);

  const queryKey: QueryKey = ["followers-info", userId];

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowerByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
  
      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);
  
      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          (previousState?.followers ?? 0) +
          (previousState?.isFollowerByUser ? -1 : 1),
        isFollowerByUser: !previousState?.isFollowerByUser,
      }));
  
      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    },
  });  
  
  return <Button 
    variant={data.isFollowerByUser ? "secondary" : "default"}
    onClick = {() => mutate()}
  >
    {data.isFollowerByUser ? "UnFollow" : "Follow"}
  </Button> 
}