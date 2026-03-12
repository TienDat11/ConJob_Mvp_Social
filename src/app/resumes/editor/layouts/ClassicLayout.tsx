import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { formatDate } from "date-fns";
import Image from "next/image";
import { getPhotoSrc } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Github, Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { translations } from "../translations";

interface ResumeLayoutProps {
  resumeData: ResumeValues;
  className?: string;
}

export default function ClassicLayout({ resumeData, className }: ResumeLayoutProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const { photo, firstName, lastName, jobTitle, city, country, phone, email, colorHex, borderStyle, summary, workExperiences, educations, skills, githubUrl } = resumeData;
  const photoSrc = getPhotoSrc(photo);
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  return (
    <div className={cn("w-full bg-white p-10 min-h-[297mm]", className)}>
      <div className="flex items-center justify-between border-b pb-6 mb-6">
        <div className="space-y-2.5">
          <div>
            <h1
              className="text-4xl font-extrabold tracking-tight break-words leading-[1.1]"
              style={{ color: colorHex || "#000" }}
            >
              {fullName}
            </h1>
            <p className="text-xl font-medium text-gray-600">{jobTitle}</p>
          </div>

          <div className="flex flex-col gap-1.5 text-sm text-gray-500">
            {(city || country) && (
              <div className="flex items-center gap-2">
                <MapPin className="size-4" style={{ color: colorHex }} />
                <span>{[city, country].filter(Boolean).join(", ")}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-2">
                <Mail className="size-4" style={{ color: colorHex }} />
                <span>{email}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2">
                <Phone className="size-4" style={{ color: colorHex }} />
                <span>{phone}</span>
              </div>
            )}
            {githubUrl && (
              <div className="flex items-center gap-2">
                <Github className="size-4" style={{ color: colorHex }} />
                <span className="text-xs break-all">{githubUrl}</span>
              </div>
            )}
          </div>
        </div>

        {photoSrc && (
          <div
            className="shrink-0 overflow-hidden border-2 border-gray-100 shadow-sm"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: borderStyle === "square" ? "4px" : borderStyle === "rounded" ? "50%" : "18px",
            }}
          >
            <Image
              src={photoSrc}
              alt="Profile photo"
              width={120}
              height={120}
              className="size-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="space-y-8">
        {summary && (
          <div className="break-inside-avoid space-y-3 resume-section">
            <h2
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: colorHex || "#000" }}
            >
              {t.cvProfile}
            </h2>
            <div className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
              {summary}
            </div>
          </div>
        )}

        {workExperiences && workExperiences.length > 0 && (
          <div className="space-y-4 resume-section">
            <h2
              className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3"
              style={{ color: colorHex || "#000", borderColor: colorHex ? `${colorHex}40` : "#e5e7eb" }}
            >
              {t.cvWorkExperience}
            </h2>
            <div className="space-y-5">
              {workExperiences.map((exp, index) => (
                <div key={`${exp.position}-${index}`} className="break-inside-avoid resume-job-entry">
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="text-base font-bold text-gray-900">
                      {exp.position}
                    </h3>
                    <span className="text-xs font-medium text-gray-500 tabuli">
                      {exp.startDate ? formatDate(new Date(exp.startDate), "MMM yyyy") : ""} -{" "}
                      {exp.endDate
                        ? formatDate(new Date(exp.endDate), "MMM yyyy")
                        : t.present}
                    </span>
                  </div>
                  {exp.company && (
                    <p className="text-sm font-semibold text-gray-700 mb-2 resume-body-text">
                      {exp.company}
                    </p>
                  )}
                  <div className="whitespace-pre-line text-sm text-gray-600 leading-snug resume-body-text">
                    {exp.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {educations && educations.length > 0 && (
          <div className="space-y-4 resume-section">
            <h2
              className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3"
              style={{ color: colorHex || "#000", borderColor: colorHex ? `${colorHex}40` : "#e5e7eb" }}
            >
              {t.cvEducation}
            </h2>
            <div className="space-y-4">
              {educations.map((edu, index) => (
                <div key={`${edu.school}-${index}`} className="break-inside-avoid resume-job-entry">
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="text-base font-bold text-gray-900">
                      {edu.school}
                    </h3>
                    <span className="text-xs font-medium text-gray-500">
                      {edu.startDate ? formatDate(new Date(edu.startDate), "MMM yyyy") : ""} -{" "}
                      {edu.endDate
                        ? formatDate(new Date(edu.endDate), "MMM yyyy")
                        : t.present}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 resume-body-text">
                    {edu.degree}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills && skills.length > 0 && (
          <div className="break-inside-avoid space-y-3 resume-section">
            <h2
              className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3"
              style={{ color: colorHex || "#000", borderColor: colorHex ? `${colorHex}40` : "#e5e7eb" }}
            >
              {t.cvSkills}
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge
                  key={`${skill}-${index}`}
                  className="rounded-md border-none px-3 py-1 text-xs font-medium text-white shadow-none print:px-3 print:py-1"
                  style={{
                    backgroundColor: colorHex || "#000",
                  }}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
