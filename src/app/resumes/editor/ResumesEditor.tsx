"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Globe } from "lucide-react";

import { cn, mapToResumeValues } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { ResumeServerData } from "@/lib/types";

import Breadcrumbs from "./Breadcrumbs";
import Footer from "./Footer";
import { steps } from "./steps";
import useAutoSaveResume from "./useAutoSaveResume";
import ResumeEditorPreview from "./ResumeEditorPreview";
import useUnloadWarning from "@/hooks/useUnloadWarning";
import { LanguageProvider, useLanguage, Language } from "./LanguageContext";
import { translations } from "./translations";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ResumeEditorProps {
  resumeToEdit: ResumeServerData | null;
}

export default function ResumeEditor({
  resumeToEdit,
}: Readonly<ResumeEditorProps>) {
  return (
    <LanguageProvider>
      <ResumeEditorInner resumeToEdit={resumeToEdit} />
    </LanguageProvider>
  );
}

function ResumeEditorInner({
  resumeToEdit,
}: Readonly<ResumeEditorProps>) {
  const searchParams = useSearchParams();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const [resumeData, setResumeData] = useState<ResumeValues>(
    resumeToEdit ? mapToResumeValues(resumeToEdit) : {},
  );

  const [showSmResumePreview, setShowSmResumePreview] = useState(false);

  const { isSaving, hasUnsavedChanges } = useAutoSaveResume(resumeData);

  useUnloadWarning(hasUnsavedChanges);

  const currentStep = searchParams.get("step") ?? steps[0].key;

  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("step", key);
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  }

  const FormComponent = steps.find((step) => step.key === currentStep)
    ?.component;

  return (
    <div className="flex grow flex-col">
      <header className="border-b px-3 py-5 text-center space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex-1" />
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold">{t.editorTitle}</h1>
            <p className="text-sm text-muted-foreground">
              {t.editorSubtitle}
            </p>
          </div>
          <div className="flex-1 flex justify-end pr-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Globe className="size-4" />
                  {language === "en" ? "EN" : "VI"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setLanguage("en")}
                  className={cn(language === "en" && "font-semibold")}
                >
                  🇬🇧 {t.langEn}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("vi")}
                  className={cn(language === "vi" && "font-semibold")}
                >
                  🇻🇳 {t.langVi}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full">
          <div
            className={cn(
              "w-full space-y-6 overflow-y-auto p-3 md:block md:w-1/2",
              showSmResumePreview && "hidden",
            )}
          >
            <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
            {FormComponent && (
              <FormComponent
                resumeData={resumeData}
                setResumeData={setResumeData}
              />
            )}
          </div>
          <div className="grow md:border-r" />
          <ResumeEditorPreview
            resumeData={resumeData}
            className={cn(showSmResumePreview && "flex")}
          />
        </div>
      </main>
      <Footer
        currentStep={currentStep}
        setCurrentStep={setStep}
        showSmResumePreview={showSmResumePreview}
        setShowSmResumePreview={setShowSmResumePreview}
        isSaving={isSaving}
      />
    </div>
  );
}
