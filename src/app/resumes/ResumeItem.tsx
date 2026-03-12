"use client";

import ResumePreview from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useExportPDF } from "@/hooks/useExportPDF";
import { ResumeServerData } from "@/lib/types";
import { mapToResumeValues } from "@/lib/utils";
import { formatDate } from "date-fns";
import { MoreVertical, ImageIcon, Printer } from "lucide-react";
import Link from "next/link";
import { useMemo, useRef } from "react";
import { useExportImage } from "@/hooks/useExportImage";

interface ResumeItemProps {
  resume: ResumeServerData;
}

export default function ResumeItem({ resume }: ResumeItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const { exportPDF, isExportingPDF } = useExportPDF({ contentRef, fileName: `${resume.firstName || resume.title || "Resume"}_${resume.lastName || "CV"}` });

  const { exportImage, isExporting } = useExportImage({
    contentRef,
    fileName: `${resume.firstName || resume.title || "Resume"}_${resume.lastName || "CV"}`,
  });

  const previewData = useMemo(() => mapToResumeValues(resume), [resume]);
  const wasUpdated = resume.updatedAt !== resume.createdAt;

  return (
    <div className="group relative rounded-lg border border-transparent bg-secondary p-3 transition-colors hover:border-border">
      <div className="space-y-3">
        <Link
          href={`/resumes/editor?resumeId=${resume.id}`}
          className="inline-block w-full text-center"
        >
          <p className="line-clamp-1 font-semibold">
            {resume.title || "No title"}
          </p>
          {resume.description && (
            <p className="line-clamp-2 text-sm">{resume.description}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {wasUpdated ? "Updated" : "Created"} on{" "}
            {formatDate(resume.updatedAt, "MMM d, yyyy h:mm a")}
          </p>
        </Link>
        <Link
          href={resume.githubUrl || `/resumes/editor?resumeId=${resume.id}`}
          target={resume.githubUrl ? "_blank" : undefined}
          rel={resume.githubUrl ? "noopener noreferrer" : undefined}
          className="relative inline-block w-full"
        >
          <ResumePreview
            resumeData={previewData}
            contentRef={contentRef}
            className="overflow-hidden shadow-sm transition-shadow group-hover:shadow-lg"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </Link>
      </div>
      <MoreMenu resumeId={resume.id} onExportPDFClick={exportPDF} onExportImageClick={exportImage} isExporting={isExporting} isExportingPDF={isExportingPDF} />
    </div>
  );
}

interface MoreMenuProps {
  resumeId: string;
  onExportPDFClick: () => void;
  onExportImageClick: () => void;
  isExporting: boolean;
  isExportingPDF: boolean;
}

function MoreMenu({ resumeId, onExportPDFClick, onExportImageClick, isExporting, isExportingPDF }: MoreMenuProps) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0.5 top-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={onExportPDFClick}
            disabled={isExportingPDF || isExporting}
          >
            <Printer className="size-4" />
            Download PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={onExportImageClick}
            disabled={isExporting}
          >
            <ImageIcon className="size-4" />
            Export as PNG
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
