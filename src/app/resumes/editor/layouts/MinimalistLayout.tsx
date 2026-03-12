import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { useLanguage } from "../LanguageContext";
import { translations } from "../translations";

interface ResumeLayoutProps {
    resumeData: ResumeValues;
    className?: string;
}

export default function MinimalistLayout({ resumeData, className }: ResumeLayoutProps) {
    const { language } = useLanguage();
    const t = translations[language];

    const {
        firstName,
        lastName,
        jobTitle,
        city,
        country,
        phone,
        email,
        workExperiences,
        educations,
        skills,
        summary,
        githubUrl,
    } = resumeData;

    const hasName = firstName || lastName;
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    const hasContact = email || phone || city || country;
    const hasExperience = workExperiences && workExperiences.length > 0;
    const hasEducation = educations && educations.length > 0;
    const hasSkills = skills && skills.length > 0;

    return (
        <div className={cn("bg-white min-h-[297mm] font-sans px-12 py-16 print:min-h-0 resume-container", className)}>
            <div className="max-w-3xl">
                <header className="mb-24">
                    {hasName && (
                        <h1 className="font-black text-6xl tracking-[-0.04em] uppercase text-neutral-900 break-words leading-[1] max-w-4xl">
                            {fullName}
                        </h1>
                    )}
                    {jobTitle && (
                        <p className="font-normal text-xs uppercase tracking-[0.4em] text-neutral-400 mt-6">
                            {jobTitle}
                        </p>
                    )}
                    {hasContact && (
                        <div className="flex gap-8 font-normal text-[11px] text-neutral-500 mt-6">
                            {email && <span>{email}</span>}
                            {phone && <span>{phone}</span>}
                            {[city, country].filter(Boolean).length > 0 && (
                                <span>{[city, country].filter(Boolean).join(", ")}</span>
                            )}
                            {githubUrl && <span className="text-xs break-all">{githubUrl}</span>}
                        </div>
                    )}
                </header>

                {summary && (
                    <p className="font-light text-sm leading-[1.9] text-neutral-600 mb-20 max-w-2xl resume-body-text">
                        {summary}
                    </p>
                )}

                {hasExperience && (
                    <section className="mb-20 resume-section">
                        <h2 className="font-bold text-xs uppercase tracking-[0.35em] text-neutral-900 mb-10">
                            {t.cvWorkExperience}
                        </h2>
                        <div className="space-y-12">
                            {workExperiences?.map((exp, i) => (
                                <article key={i} className="grid grid-cols-[25%_75%] gap-10 break-inside-avoid resume-job-entry">
                                    <div className="text-right pr-4">
                                        <time className="font-mono text-[11px] text-neutral-400 tabular-nums">
                                            {exp.startDate ? formatDate(new Date(exp.startDate), "yyyy") : ""}
                                            {(exp.startDate || exp.endDate) && " — "}
                                            {exp.endDate ? formatDate(new Date(exp.endDate), "yyyy") : t.present}
                                        </time>
                                    </div>
                                    <div>
                                        {exp.position && (
                                            <h3 className="font-bold text-sm text-neutral-900 mb-1">
                                                {exp.position}
                                            </h3>
                                        )}
                                        {exp.company && (
                                            <p className="font-normal text-[11px] text-neutral-500 mb-3 resume-body-text">
                                                {exp.company}
                                            </p>
                                        )}
                                        {exp.description && (
                                            <p className="font-light text-sm leading-[1.8] text-neutral-600 whitespace-pre-line resume-body-text">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {hasEducation && (
                    <section className="mb-20 resume-section">
                        <h2 className="font-bold text-xs uppercase tracking-[0.35em] text-neutral-900 mb-10">
                            {t.cvEducation}
                        </h2>
                        <div className="space-y-12">
                            {educations?.map((edu, i) => (
                                <article key={i} className="grid grid-cols-[25%_75%] gap-10 break-inside-avoid resume-job-entry">
                                    <div className="text-right pr-4">
                                        <time className="font-mono text-[11px] text-neutral-400 tabular-nums">
                                            {edu.startDate ? formatDate(new Date(edu.startDate), "yyyy") : ""}
                                            {(edu.startDate || edu.endDate) && " — "}
                                            {edu.endDate ? formatDate(new Date(edu.endDate), "yyyy") : t.present}
                                        </time>
                                    </div>
                                    <div>
                                        {edu.school && (
                                            <h3 className="font-bold text-sm text-neutral-900 mb-1">
                                                {edu.school}
                                            </h3>
                                        )}
                                        {edu.degree && (
                                            <p className="font-normal text-[11px] text-neutral-500 resume-body-text">
                                                {edu.degree}
                                            </p>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {hasSkills && (
                    <div className="font-light text-xs text-neutral-400 pt-8 border-t border-neutral-100">
                        {t.cvSkills}: {skills!.join(", ")}
                    </div>
                )}
            </div>
        </div>
    );
}
