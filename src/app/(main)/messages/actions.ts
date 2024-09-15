import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useChatContext } from "stream-chat-react";
import { useToast } from "@/components/ui/use-toast";

export function useUpdateChannelName(channelId: string) {
  const { client } = useChatContext();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const mutation = useMutation({
    mutationFn: async (newName: string) => {
      const channel = client.channel("messaging", channelId);
      const channelState = await channel.watch();

      const isUserInChannel = channelState.members.some(
        (member) => member.user_id === client.userID
      );

      if (!isUserInChannel) {
        throw new Error("User not in channel");
      }

      await channel.update({ name: newName });
      return channel;
    },
    onSuccess: (channel) => {
      toast({
        description: `Channel name updated to "${channel.data?.name}"`,
      });
    },
    onError: (error) => {
      console.error("Error updating channel name", error);
      toast({
        variant: "destructive",
        description: "Error updating channel name. Please try again.",
      });
    },
  });

  const updateChannelName = async (newName: string) => {
    setIsUpdating(true);
    try {
      await mutation.mutateAsync(newName);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    updateChannelName,
  };
}
