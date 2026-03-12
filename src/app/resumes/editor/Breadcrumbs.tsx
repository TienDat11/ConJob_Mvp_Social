import { steps } from "./steps";
import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { translations } from "./translations";

interface BreadcrumbsProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
}

export default function Breadcrumbs({ currentStep, setCurrentStep }: Readonly<BreadcrumbsProps>) {
  const { language } = useLanguage();
  const t = translations[language];

  const stepTitleMap: Record<string, string> = {
    "general-info": t.stepGeneral,
    "personal-info": t.stepPersonal,
    "workExperiences-info": t.stepExperience,
    "education-info": t.stepEducation,
    "skills-info": t.stepSkills,
    "summary-info": t.stepSummary,
    "design": t.stepDesign,
  };

  return (
    <div className="flex justify-center w-full overflow-x-auto pb-4 px-2 scrollbar-none">
      <div className="flex items-center space-x-2">
        {steps.map((step, index) => {
          const isActive = step.key === currentStep;
          const isCompleted = steps.findIndex(s => s.key === currentStep) > index;
          const Icon = step.icon;
          const title = stepTitleMap[step.key] ?? step.title;

          return (
            <React.Fragment key={step.key}>
              <button
                onClick={() => setCurrentStep(step.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium whitespace-nowrap border-2",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                    : isCompleted
                      ? "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80"
                      : "bg-background text-muted-foreground border-transparent hover:bg-secondary/50"
                )}
              >
                {isCompleted ? <Check className="size-4" /> : <Icon className="size-4" />}
                <span>{title}</span>
              </button>
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-4 h-0.5 rounded-full transition-colors duration-300",
                  isCompleted ? "bg-primary" : "bg-muted"
                )} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
