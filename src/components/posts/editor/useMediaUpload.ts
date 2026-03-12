import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import kyInstance from "@/lib/ky";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024;

export interface Attachment {
  file: File;
  previewUrl: string;
  mediaId?: string;
  isUploading: boolean;
  error?: string;
  retryCount?: number;
}

export default function useMediaUpload() {
  const { toast } = useToast();

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [uploadProgress, setUploadProgress] = useState<number>();
  const [validationError, setValidationError] = useState<string>();


  const [isUploading, setIsUploading] = useState(false);

  const MAX_RETRIES = 3;

  const revokeAttachmentUrls = (items: Attachment[]) => {
    items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
  };

  const hardStopUpload = (message: string) => {
    setIsUploading(false);
    setUploadProgress(undefined);
    setAttachments((prev) => {
      revokeAttachmentUrls(prev);
      return [];
    });
    setValidationError(message);

    toast({
      variant: "destructive",
      description: message,
    });
  };

  const clearValidationError = () => setValidationError(undefined);

  const startUpload = async (files: File[], retryCount: number = 0) => {

    if (isUploading && retryCount === 0) {
      toast({
        variant: "destructive",
        description: "Please wait for current upload to finish.",
      });
      return;
    }

    clearValidationError();


    if (attachments.length + files.length > 5) {
      toast({
        variant: "destructive",
        description: "You can only upload up to 5 attachments per post.",
      });
      return;
    }


    const hasVideo = files.some((f) => f.type.startsWith("video/"));
    const hasImage = files.some((f) => f.type.startsWith("image/"));
    const existingVideo = attachments.some((a) => a.file.type.startsWith("video/"));

    const oversizedFile = files.find((file) => {
      if (file.type.startsWith("image/")) return file.size > MAX_IMAGE_SIZE_BYTES;
      if (file.type.startsWith("video/")) return file.size > MAX_VIDEO_SIZE_BYTES;
      return false;
    });

    if (oversizedFile) {
      const isImage = oversizedFile.type.startsWith("image/");
      hardStopUpload(
        `${oversizedFile.name} is too large. ${isImage ? "Images must be <= 5MB" : "Videos must be <= 50MB"}. Upload canceled.`,
      );
      return;
    }

    if (hasVideo && (hasImage || existingVideo)) {
      toast({
        variant: "destructive",
        description: "Cannot mix images and videos in the same post.",
      });
      return;
    }


    setAttachments((prev) => {
      const toReplace = prev.filter((a) => files.includes(a.file));
      revokeAttachmentUrls(toReplace);

      return [
        ...prev.filter((a) => !files.includes(a.file)),
        ...files.map((file) => ({
          file,
          previewUrl: URL.createObjectURL(file),
          mediaId: undefined,
          isUploading: true,
          error: undefined,
          retryCount,
        })),
      ];
    });

    setIsUploading(true);
    setUploadProgress(0);

    try {

      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));


      setUploadProgress(20);
      const response = await kyInstance
        .post("/api/upload/post-media", {
          body: formData,
          timeout: false,
        })
        .json<{ media: Array<{ id: string; type: string; url: string }> }>();

      setUploadProgress(100);


      const uploadedMediaMap = new Map(
        files.map((file, index) => [file, response.media[index]] as const),
      );

      setAttachments((prev) =>
        prev.map((attachment) => {
          if (!uploadedMediaMap.has(attachment.file)) {
            return attachment;
          }

          const mediaData = uploadedMediaMap.get(attachment.file);

          return {
            ...attachment,
            mediaId: mediaData?.id || undefined,
            isUploading: false,
            error: undefined,
            retryCount,
          };
        }),
      );

      console.log("[useMediaUpload] Upload complete:", {
        fileCount: files.length,
        mediaIds: response.media.map((a) => a.id),
      });
    } catch (error) {
      console.error("[useMediaUpload] Upload error:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Upload failed. Please try again.";


      setAttachments((prev) =>
        prev.map((a) =>
          files.includes(a.file)
            ? { ...a, isUploading: false, error: errorMessage, retryCount }
            : a,
        ),
      );


      toast({
        variant: "destructive",
        description: errorMessage,
      });


      if (retryCount < MAX_RETRIES && isNetworkError(error)) {
        console.log(`[useMediaUpload] Retrying... (${retryCount + 1}/${MAX_RETRIES})`);


        const backoffDelay = Math.pow(2, retryCount) * 1000;

        setTimeout(() => {
          startUpload(files, retryCount + 1);
        }, backoffDelay);

        return;
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(undefined);
    }
  };


  function isNetworkError(error: unknown): boolean {
    if (!(error instanceof Error)) return false;

    const retryableErrors = [
      "Network request failed",
      "Failed to fetch",
      "ECONNRESET",
      "ETIMEDOUT",
      "ENETDOWN",
    ];

    return retryableErrors.some((err) =>
      error.message.toLowerCase().includes(err.toLowerCase()),
    );
  }

  function handleStartUpload(files: File[]) {
    startUpload(files, 0);
  }

  function retryUpload(fileName: string) {
    const attachment = attachments.find((a) => a.file.name === fileName);
    if (!attachment) return;

    console.log(`[useMediaUpload] Retrying file: ${fileName}`);
    startUpload([attachment.file], (attachment.retryCount || 0) + 1);
  }

  function removeAttachment(fileName: string) {
    setAttachments((prev) => {
      const removing = prev.filter((a) => a.file.name === fileName);
      revokeAttachmentUrls(removing);
      return prev.filter((a) => a.file.name !== fileName);
    });
  }

  function reset() {
    setAttachments((prev) => {
      revokeAttachmentUrls(prev);
      return [];
    });
    setUploadProgress(undefined);
    setValidationError(undefined);
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadProgress,
    validationError,
    clearValidationError,
    removeAttachment,
    retryUpload,
    reset,
  };
}
