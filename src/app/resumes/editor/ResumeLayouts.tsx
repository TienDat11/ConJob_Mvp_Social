"use client";

import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { formatDate } from "date-fns";
import Image from "next/image";
import { getPhotoSrc } from "@/lib/utils";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  className?: string;
}

function ClassicLayout({ resumeData, className }: { resumeData: ResumeValues; className?: string }) {
  const { photo, firstName, lastName, jobTitle, city, country, phone, email, colorHex, borderStyle, summary, workExperiences, educations, skills } = resumeData;
  const photoSrc = getPhotoSrc(photo);

  return (
    <div className={cn("w-full p-6", className)}>
      <div className="flex justify-between items-start gap-6 mb-6">
        {photo ? (
          <div
            style={{
              borderRadius: borderStyle === "square" ? "4px" : "50%",
              backgroundColor: colorHex || "#000",
              padding: "8px",
            }}
            className="overflow-hidden"
          >
            <Image
              src={photoSrc}
              alt="Profile photo"
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
        ) : null}
        <div className="flex-1">
          <h1
            className="text-2xl font-bold"
            style={{ color: colorHex || "#000" }}
          >
            {firstName} {lastName}
          </h1>
          <p className="text-sm text-gray-600">
            {jobTitle && <span className="font-semibold">{jobTitle}</span>}
            {[city, country].filter(Boolean).join(", ")}
          </p>
          <div className="text-xs mt-1">
            {[email, phone].filter(Boolean).join(" • ")}
          </div>
        </div>
      </div>

      {summary && (
        <div className="mb-6">
          <h2
            className="text-lg font-semibold mb-2"
            style={{ color: colorHex || "#000" }}
          >
            Profile
          </h2>
          <p
            className="text-sm leading-relaxed whitespace-pre-line"
          >
            {summary}
          </p>
        </div>
      )}

      {workExperiences && workExperiences.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: colorHex || "#000" }}
          >
            Work Experience
          </h2>
          <div className="space-y-3">
            {workExperiences.map((exp, index) => {
              const startDate = exp.startDate
                ? formatDate(new Date(exp.startDate), "MM/yyyy")
                : "";
              const endDate = exp.endDate
                ? formatDate(new Date(exp.endDate), "MM/yyyy")
                : "Present";

              return (
                <div key={`${exp.position}-${index}`} className="break-inside-avoid space-y-1">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>{exp.position || "Position"}</span>
                    <span>
                      {startDate} - {endDate}
                    </span>
                  </div>
                  {exp.company && (
                    <p className="text-xs font-semibold mb-1" style={{ color: colorHex || "#000" }}>
                      {exp.company}
                    </p>
                  )}
                  {exp.description && (
                    <div className="whitespace-pre-line text-xs">
                      {exp.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {educations && educations.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: colorHex || "#000" }}
          >
            Education
          </h2>
          <div className="space-y-3">
            {educations.map((edu, index) => {
              const startDate = edu.startDate
                ? formatDate(new Date(edu.startDate), "MM/yyyy")
                : "";
              const endDate = edu.endDate
                ? formatDate(new Date(edu.endDate), "MM/yyyy")
                : "Present";

              return (
                <div key={`${edu.school}-${index}`} className="break-inside-avoid space-y-1">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>{edu.degree || "Degree"}</span>
                    <span>
                      {startDate} - {endDate}
                    </span>
                  </div>
                  {edu.school && (
                    <p className="text-xs font-semibold" style={{ color: colorHex || "#000" }}>
                      {edu.school}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {skills && skills.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: colorHex || "#000" }}
          >
            Skills
          </h2>
          <div className="flex break-inside-avoid flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  backgroundColor: colorHex,
                  color: "#fff",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResumeLayouts({ resumeData, className }: ResumePreviewProps) {
  return <ClassicLayout resumeData={resumeData} className={className} />;
}
