import kyInstance from "@/lib/ky";
import { BookmarkInfo } from "@/lib/types";
import { QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import { BookmarkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  postId: string,
  initialState: BookmarkInfo
}

export default function BookmarkButton({postId, initialState}: Readonly<BookmarkButtonProps>) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const queryKey: QueryKey =  ["bookmark-info", postId];
  const {data} = useQuery({
    queryKey,
    queryFn: () => kyInstance.get(`/api/posts/${postId}/bookmark`).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const {mutate} = useMutation({
    mutationFn: () => data.isBookmarkInfo 
    ? kyInstance.delete(`/api/posts/${postId}/bookmark`) 
    : kyInstance.post(`/api/posts/${postId}/bookmark`),

    onMutate: async () => {
      toast({
        description: `Post ${data.isBookmarkInfo ? "un" : ""}bookmarked`
      })

      await queryClient.cancelQueries({ queryKey })

      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkInfo: !previousState?.isBookmarkInfo
      }));

      return { previousState };
    },

    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again",
      });
    },
  });

  return <button onClick={() => mutate()} className="flex items-center gap-3">
    <BookmarkIcon className={cn("size-5", data.isBookmarkInfo && "fill-primary text-primary")} />
  </button>
}
