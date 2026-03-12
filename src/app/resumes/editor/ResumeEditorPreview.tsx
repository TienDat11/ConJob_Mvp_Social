"use client"

import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";

import ResumePreview from "@/components/ResumePreview";

import { useRef } from "react";
import { useExportPDF } from "@/hooks/useExportPDF";
import { ImageIcon, Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExportImage } from "@/hooks/useExportImage";

interface ResumeEditorPreviewProps {
  resumeData: ResumeValues;
  className?: string;
}

export default function ResumeEditorPreview({
  resumeData,
  className,
}: Readonly<ResumeEditorPreviewProps>) {


  const contentRef = useRef<HTMLDivElement>(null);

  const { exportImage, isExporting } = useExportImage({
    contentRef,
    fileName: `${resumeData.firstName || "Resume"}_${resumeData.lastName || "CV"}`,
  });

  const { exportPDF, isExportingPDF } = useExportPDF({ contentRef, fileName: `${resumeData.firstName || "Resume"}_${resumeData.lastName || "CV"}` });


  return (
    <div
      className={cn(
        "group relative hidden w-full md:flex md:w-1/2 flex-col",
        className,
      )}
    >
      <div className="absolute left-3 top-3 z-10 flex gap-2 opacity-50 transition-opacity group-hover:opacity-100">
        <Button
          variant="outline"
          size="sm"
          onClick={exportPDF}
          disabled={isExportingPDF || isExporting}
          className="gap-2 bg-background shadow-sm hover:bg-background/90"
          title="Download PDF"
        >
          {isExportingPDF ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Printer className="size-4" />
          )}
          Save as PDF
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={exportImage}
          disabled={isExporting}
          className="gap-2 bg-background shadow-sm hover:bg-background/90"
          title="Save as Image"
        >
          {isExporting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ImageIcon className="size-4" />
          )}
          Save as Image
        </Button>
      </div>

      <div className="flex w-full justify-center overflow-y-auto bg-secondary p-3 h-full">
        <ResumePreview
          resumeData={resumeData}
          contentRef={contentRef}
          className="max-w-2xl shadow-md"
        />
      </div>
    </div>
  );
}
