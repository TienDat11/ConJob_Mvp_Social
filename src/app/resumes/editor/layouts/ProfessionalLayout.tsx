import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import Image from "next/image";
import { getPhotoSrc } from "@/lib/utils";
import { useLanguage } from "../LanguageContext";
import { translations } from "../translations";

interface ResumeLayoutProps {
    resumeData: ResumeValues;
    className?: string;
}

export default function ProfessionalLayout({ resumeData, className }: ResumeLayoutProps) {
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
        workExperiences,
        educations,
        skills,
        summary,
        githubUrl,
    } = resumeData;

    const photoSrc = getPhotoSrc(photo);
    const accentColor = colorHex || "#171717";
    
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    
    const nameWords = fullName.split(" ").filter(Boolean);
    const isLongName = nameWords.length > 4 || fullName.length > 25;
    const nameFontSize = isLongName ? "text-2xl" : "text-3xl";

    const hasName = firstName || lastName;
    const hasContact = email || phone || city || country;
    const hasExperience = workExperiences && workExperiences.length > 0;
    const hasEducation = educations && educations.length > 0;
    const hasSkills = skills && skills.length > 0;

    return (
        <div className={cn("bg-white min-h-[297mm] font-sans print:min-h-0", className)}>
            <div className="grid grid-cols-[30%_70%] min-h-[297mm]">
                <aside className="bg-neutral-50 print:bg-neutral-50/50 p-10 space-y-8">
                    {photoSrc && (
                        <div className="w-[120px] h-[120px] overflow-hidden">
                            <Image
                                src={photoSrc}
                                alt="Profile"
                                width={120}
                                height={120}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {hasSkills && (
                        <div>
                            <h3 className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500 mb-3">
                                {t.cvSkills}
                            </h3>
                            <div className="font-sans text-[10px] uppercase tracking-[0.1em] text-neutral-600 leading-relaxed">
                                {skills?.map((skill, i) => (
                                    <span key={i}>
                                        {skill}
                                        {i < (skills?.length ?? 0) - 1 && <span className="text-neutral-300"> · </span>}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {hasEducation && (
                        <div>
                            <h3 className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500 mb-3">
                                {t.cvEducation}
                            </h3>
                            <div className="space-y-4 resume-section">
                                {educations?.map((edu, i) => (
                                    <article key={i} className="break-inside-avoid resume-job-entry">
                                        {edu.school && (
                                            <h4 className="font-sans text-sm font-medium text-neutral-600">
                                                {edu.school}
                                            </h4>
                                        )}
                                        {edu.degree && (
                                            <p className="font-sans text-sm text-neutral-700 resume-body-text">
                                                {edu.degree}
                                            </p>
                                        )}
                                        <time className="font-mono text-[10px] text-neutral-400 tabular-nums">
                                            {edu.startDate ? formatDate(new Date(edu.startDate), "yyyy") : ""}
                                            {(edu.startDate || edu.endDate) && " – "}
                                            {edu.endDate ? formatDate(new Date(edu.endDate), "yyyy") : t.present}
                                        </time>
                                    </article>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                <main className="p-10 border-l border-neutral-200">
                    <header className="flex justify-between items-start mb-8 pb-8 border-b border-neutral-200">
                        <div>
                            {hasName && (
                                <h1 className={`font-serif ${nameFontSize} font-normal tracking-tight leading-[1.1] text-neutral-900 max-w-xl break-words`}>
                                    {fullName}
                                </h1>
                            )}
                            {jobTitle && (
                                <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mt-1">
                                    {jobTitle}
                                </p>
                            )}
                        </div>
                        {hasContact && (
                            <div className="text-right text-sm text-neutral-500 space-y-0.5 pl-6">
                                {email && <p className="font-medium">{email}</p>}
                                {phone && <p className="font-medium">{phone}</p>}
                                {githubUrl && <p className="font-medium text-xs break-all">{githubUrl}</p>}
                                {[city, country].filter(Boolean).length > 0 && (
                                    <p className="font-medium">{[city, country].filter(Boolean).join(", ")}</p>
                                )}
                            </div>
                        )}
                    </header>

                    {summary && (
                        <p className="font-serif italic text-sm leading-[1.7] text-neutral-700 mb-8 resume-body-text">
                            {summary}
                        </p>
                    )}

                    {hasExperience && (
                        <section className="space-y-8 resume-section">
                            <h3 className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
                                {t.cvWorkExperience}
                            </h3>
                            <div className="space-y-8">
                                {workExperiences?.map((exp, i) => (
                                    <article key={i} className="break-inside-avoid resume-job-entry">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-sans text-sm font-medium text-neutral-600">
                                                {exp.position}
                                            </h4>
                                            <time className="font-mono text-[10px] text-neutral-400 tabular-nums">
                                                {exp.startDate ? formatDate(new Date(exp.startDate), "MMM yyyy") : ""}
                                                {(exp.startDate || exp.endDate) && " – "}
                                                {exp.endDate ? formatDate(new Date(exp.endDate), "MMM yyyy") : t.present}
                                            </time>
                                        </div>
                                        {exp.company && (
                                            <p className="font-sans text-sm text-neutral-700 mb-2 resume-body-text">
                                                {exp.company}
                                            </p>
                                        )}
                                        {exp.description && (
                                            <p className="font-sans text-sm leading-[1.7] text-neutral-700 whitespace-pre-line resume-body-text">
                                                {exp.description}
                                            </p>
                                        )}
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}
