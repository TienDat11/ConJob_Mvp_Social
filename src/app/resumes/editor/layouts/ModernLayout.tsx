import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import Image from "next/image";
import { getPhotoSrc } from "@/lib/utils";
import { Github, Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { translations } from "../translations";

interface ResumeLayoutProps {
    resumeData: ResumeValues;
    className?: string;
}

export default function ModernLayout({ resumeData, className }: ResumeLayoutProps) {
    const { language } = useLanguage();
    const t = translations[language];

    const {
        photo,
        firstName,
        lastName,
        jobTitle,
        city,
        country,
        phone,
        email,
        colorHex,
        borderStyle,
        summary,
        workExperiences,
        educations,
        skills,
        githubUrl,
    } = resumeData;

    const photoSrc = getPhotoSrc(photo);
    const primaryColor = colorHex || "#000000";
    
    const fullName = [firstName, lastName].filter(Boolean).join(" ");

    return (
        <div className={cn("grid grid-cols-[1fr_2fr] min-h-[297mm] resume-container print:grid-cols-[1fr_2fr]", className)}>
            <div
                className="modern-sidebar relative text-white"
                style={{ 
                    background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 50%, ${primaryColor}bb 100%)`,
                    backgroundColor: primaryColor,
                    ['--sidebar-color' as string]: primaryColor
                }}
            >
                <div className="modern-sidebar-gradient absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 pointer-events-none" />
                <div className="modern-sidebar-blur absolute top-0 right-0 -mr-16 -mt-16 size-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                <div className="modern-sidebar-blur absolute bottom-0 left-0 -ml-16 -mb-16 size-48 rounded-full bg-black/20 blur-3xl pointer-events-none" />

                <div className="relative z-10 h-full overflow-y-auto p-5 print:p-4 print:overflow-visible">
                    <div className="space-y-5 print:space-y-4">
                        <div className="space-y-4 text-center">
                            {photoSrc && (
                                <div
                                    className="mx-auto overflow-hidden border-4 border-white/20 shadow-lg print:border-2"
                                    style={{
                                        width: "120px",
                                        height: "120px",
                                        borderRadius: borderStyle === "square" ? "4px" : borderStyle === "rounded" ? "50%" : "20px",
                                    }}
                                >
                                    <Image
                                        src={photoSrc}
                                        alt="Profile"
                                        width={120}
                                        height={120}
                                        className="size-full object-cover"
                                    />
                                </div>
                            )}
                            <div>
                                <h1 className="text-2xl print:text-xl font-black uppercase tracking-[0.08em] print:tracking-normal leading-tight mb-1 break-words">
                                    {fullName}
                                </h1>
                                <p className="mt-2 text-white/90 font-semibold tracking-[0.05em] print:tracking-normal text-sm bg-white/10 py-1.5 px-3 print:py-1 print:px-2 rounded-full inline-block backdrop-blur-sm print:backdrop-blur-none">
                                    {jobTitle}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm text-white/90 pt-5 print:pt-4 border-t border-white/20">
                            {(city || country) && (
                                <div className="flex items-center gap-3">
                                    <div className="size-7 print:size-6 flex items-center justify-center rounded-full bg-white/10 shrink-0">
                                        <MapPin className="size-3.5 print:size-3" />
                                    </div>
                                    <span className="font-medium">{[city, country].filter(Boolean).join(", ")}</span>
                                </div>
                            )}
                            {email && (
                                <div className="flex items-center gap-3">
                                    <div className="size-7 print:size-6 flex items-center justify-center rounded-full bg-white/10 shrink-0">
                                        <Mail className="size-3.5 print:size-3" />
                                    </div>
                                    <span className="break-all font-medium">{email}</span>
                                </div>
                            )}
                            {phone && (
                                <div className="flex items-center gap-3">
                                    <div className="size-7 print:size-6 flex items-center justify-center rounded-full bg-white/10 shrink-0">
                                        <Phone className="size-3.5 print:size-3" />
                                    </div>
                                    <span className="font-medium">{phone}</span>
                                </div>
                            )}
                            {githubUrl && (
                                <div className="flex items-center gap-3">
                                    <div className="size-7 print:size-6 flex items-center justify-center rounded-full bg-white/10 shrink-0">
                                        <Github className="size-3.5 print:size-3" />
                                    </div>
                                    <span className="font-medium text-xs break-all">{githubUrl}</span>
                                </div>
                            )}
                        </div>

                        {skills && skills.length > 0 && (
                            <div className="pt-5 print:pt-4 border-t border-white/20">
                                <h3 className="uppercase tracking-widest font-bold mb-3 print:mb-2 text-white/80 text-sm flex items-center gap-2">
                                    <span>{t.cvSkills}</span>
                                    <div className="h-px bg-white/20 grow" />
                                </h3>
                                <div className="flex flex-wrap gap-1.5 print:gap-1">
                                    {skills.map((skill, index) => (
                                        <span key={index} className="bg-white/20 hover:bg-white/30 transition-colors px-2.5 py-1 rounded-md text-xs font-medium backdrop-blur-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 print:p-6 space-y-6 print:space-y-5 text-slate-800 relative overflow-y-auto print:overflow-visible">
                {summary && (
                    <div className="space-y-3 resume-section">
                        <h2 className="text-xl font-bold uppercase tracking-widest flex items-center gap-3" style={{ color: primaryColor }}>
                            <span className="grow-0">{t.cvProfile}</span>
                            <div className="h-1 grow bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full w-20 rounded-full" style={{ backgroundColor: primaryColor }} />
                            </div>
                        </h2>
                        <p className="text-sm leading-relaxed text-slate-600 bg-slate-50 p-4 rounded-r-xl border-l-4 resume-body-text" style={{ borderColor: primaryColor }}>
                            {summary}
                        </p>
                    </div>
                )}

                {workExperiences && workExperiences.length > 0 && (
                    <div className="space-y-4 resume-section">
                        <h2 className="text-xl font-bold uppercase tracking-widest flex items-center gap-3" style={{ color: primaryColor }}>
                            <span className="grow-0">{t.cvWorkExperience}</span>
                            <div className="h-1 grow bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full w-20 rounded-full" style={{ backgroundColor: primaryColor }} />
                            </div>
                        </h2>
                        <div className="space-y-6">
                            {workExperiences.map((exp, index) => (
                                <div key={index} className="relative pl-5 border-l-2 border-slate-200 resume-job-entry">
                                    <div className="absolute -left-[9px] top-1.5 size-4 rounded-full border-4 border-white bg-slate-400" style={{ borderColor: "white", backgroundColor: primaryColor }} />

                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-lg text-slate-800">{exp.position}</h3>
                                        <span className="text-xs font-semibold text-slate-500">
                                            {exp.startDate ? formatDate(new Date(exp.startDate), "MMM yyyy") : ""} -{" "}
                                            {exp.endDate
                                                ? formatDate(new Date(exp.endDate), "MMM yyyy")
                                                : t.present}
                                        </span>
                                    </div>
                                    {exp.company && <div className="text-sm font-semibold text-slate-600 mb-2">{exp.company}</div>}
                                    <p className="text-[13.5px] text-slate-600 leading-[1.75] whitespace-pre-line resume-body-text">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {educations && educations.length > 0 && (
                    <div className="space-y-4 resume-section">
                        <h2 className="text-xl font-bold uppercase tracking-widest flex items-center gap-3" style={{ color: primaryColor }}>
                            <span className="grow-0">{t.cvEducation}</span>
                            <div className="h-1 grow bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full w-20 rounded-full" style={{ backgroundColor: primaryColor }} />
                            </div>
                        </h2>
                        <div className="space-y-4">
                            {educations.map((edu, index) => (
                                <div key={index} className="bg-slate-50 p-4 rounded-lg resume-job-entry">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-lg text-slate-800">{edu.school}</h3>
                                        <span className="text-xs font-semibold text-slate-500">
                                            {edu.startDate ? formatDate(new Date(edu.startDate), "MMM yyyy") : ""} -{" "}
                                            {edu.endDate
                                                ? formatDate(new Date(edu.endDate), "MMM yyyy")
                                                : t.present}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-600 resume-body-text">{edu.degree}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
