"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import LoadingButton from "@/components/LoadingButton";
import UserAvatar from "@/components/UserAvatar";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useSubmitPostMutation } from "./mutations";
import "./styles.css";
import { useRef, ClipboardEvent, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, X, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import useMediaUpload, { Attachment } from "./useMediaUpload";

export default function PostEditor() {
  const { user } = useSession();

  const mutation = useSubmitPostMutation();

  const {
    startUpload,
    attachments,
    isUploading,
    uploadProgress,
    validationError,
    clearValidationError,
    removeAttachment,
    retryUpload,
    reset: resetMediaUploads,
  } = useMediaUpload();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "What's crack-a-lackin'?",
      }),
    ],
    immediatelyRender: false,
  });

  const input = editor?.getText({
    blockSeparator: "\n",
  }) ?? "";


  const onSubmit = useCallback(() => {
    if (input.trim() && !isUploading) {
      mutation.mutate(
        {
          content: input,
          mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
        },
        {
          onSuccess: () => {
            editor?.commands.clearContent();
            resetMediaUploads();
          },
        },
      );
    }
  }, [input, isUploading, mutation, attachments, editor, resetMediaUploads]);


  const onPaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      const files = Array.from(e.clipboardData.items)
        .filter((item) => item.kind === "file")
        .map((item) => item.getAsFile()) as File[];

      startUpload(files);
    },
    [startUpload],
  );

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        <div className="w-full">
        <EditorContent
          editor={editor}
          className="max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3"
          onPaste={onPaste}
        />
        </div>
      </div>
      {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachment={removeAttachment}
          retryUpload={retryUpload ?? undefined}
        />
      )}
      {!!validationError && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium">{validationError}</span>
            <button
              type="button"
              onClick={clearValidationError}
              className="rounded-md border border-destructive/40 px-2 py-1 text-xs hover:bg-destructive/10"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center justify-end gap-3">
        {isUploading && (
          <div className="w-full bg-primary/30 rounded-full overflow-hidden">
            <div
              className="bg-primary text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%`}}
            >
              {uploadProgress ?? 0}%
            </div>
          </div>
        )}
        <AddAttachmentsButton
          onFilesSelected={startUpload}
          disabled={isUploading || attachments.length >= 5}
        />
        <LoadingButton
          onClick={onSubmit}
          loading={mutation.isPending}
          disabled={!input.trim() || isUploading}
          className="min-w-20"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
}

interface AddAttachmentsButtonProps {
  onFilesSelected: (file: File[]) => void,
  disabled: boolean,
}

function AddAttachmentsButton({
  onFilesSelected,
  disabled,
}: Readonly<AddAttachmentsButtonProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-primary hover:text-primary"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>
      <input
        type="file"
        accept="image/*, video/*"
        multiple
        ref={fileInputRef}
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFilesSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}

interface AttachmentPreviewsProps {
  attachments: Attachment[];
  removeAttachment: (filename: string) => void;
  retryUpload?: (filename: string) => void;
}


interface AttachmentPreviewProps {
  attachment: Attachment,
  onRemoveClick: () => void,
  onRetryClick?: () => void,
}

function AttachmentPreviews({
  attachments, removeAttachment, retryUpload
}: Readonly<AttachmentPreviewsProps>) {
  return  <div className={cn("flex flex-col gap-5", attachments.length > 1 && "sm:grid sm:grid-cols-2 ")}>
    {attachments.map(attachment => (
      <AttachmentPreview
      key={attachment.file.name}
      attachment={attachment}
      onRemoveClick={() => removeAttachment(attachment.file.name)}
      onRetryClick={retryUpload ? () => retryUpload(attachment.file.name) : undefined}
      />
    ))}
  </div>
}

function AttachmentPreview({
  attachment: { file, previewUrl, isUploading, error },
  onRemoveClick,
  onRetryClick,
}: Readonly<AttachmentPreviewProps>) {
  return <div className={cn("relative mx-auto size-fit ", isUploading && "opacity-50")}>
    {file.type.startsWith("image") ?
    (
      <img
        src={previewUrl}
        alt="Attachment Preview"
        className="size-fit max-h-[50rem] rounded-2xl"
      />
    )
    :
      (
        <video controls className="size-fit max-h-[50rem] rounded-xl w-full" preload="metadata">
          <source src={previewUrl} type={file.type} />
        </video>
      )
    }
    {error && (
      <div className="absolute inset-0 flex items-center justify-center bg-destructive/80 rounded-2xl">
        <div className="text-center text-background p-4">
          <p className="font-medium mb-2">Upload failed</p>
          <p className="text-sm mb-3">{error}</p>
          <div className="flex gap-2 justify-center">
            {onRetryClick && (
              <button
                onClick={onRetryClick}
                className="flex items-center gap-1 px-3 py-1.5 bg-background text-foreground rounded-lg hover:bg-background/90"
              >
                <RefreshCw size={16} />
                Retry
              </button>
            )}
            <button
              onClick={onRemoveClick}
              className="flex items-center gap-1 px-3 py-1.5 bg-background/50 text-foreground rounded-lg hover:bg-background/80"
            >
              <X size={16} />
              Remove
            </button>
          </div>
        </div>
      </div>
    )}
    {!isUploading && !error && (
      <button onClick={onRemoveClick} className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60">
        <X size={20} />
      </button>
    )}
  </div>
}
