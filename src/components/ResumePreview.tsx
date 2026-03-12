import { memo, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import useDimensions from "@/hooks/useDimensions";


import ClassicLayout from "@/app/resumes/editor/layouts/ClassicLayout";
import ModernLayout from "@/app/resumes/editor/layouts/ModernLayout";
import ProfessionalLayout from "@/app/resumes/editor/layouts/ProfessionalLayout";
import MinimalistLayout from "@/app/resumes/editor/layouts/MinimalistLayout";
import { useMemo } from "react";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

function ResumePreviewComponent({
  resumeData,
  contentRef,
  className,
}: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  const LayoutComponent = useMemo(() => {
    switch (resumeData.layout) {
      case "modern":
        return ModernLayout;
      case "professional":
        return ProfessionalLayout;
      case "minimalist":
        return MinimalistLayout;
      case "classic":
      default:
        return ClassicLayout;
    }
  }, [resumeData.layout]);

  return (
    <div
      className={cn(
        "aspect-[210/297] h-fit w-full bg-white text-black shadow-2xl",
        className
      )}
      ref={containerRef}
    >
      <div
        className={cn("origin-top-left resume-print-area", !width && "invisible")}
        style={{
          transform: `scale(${(1 / 794) * width})`,
          width: "210mm",
          height: "297mm",
        }}
        ref={contentRef}
        id="resumePreviewContent"
        lang="en"
      >
        <LayoutComponent resumeData={resumeData} />
      </div>
    </div>
  );
}

interface SectionProps {
  resumeData: ResumeValues;
}

export default memo(ResumePreviewComponent);
