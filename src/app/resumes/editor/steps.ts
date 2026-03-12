import React from "react";
import { User, Briefcase, GraduationCap, Award, FileText, LayoutTemplate, Settings } from "lucide-react";
import GeneralInfoForm from "./forms/GeneralInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import { EditorFormProps } from "@/lib/types";
import WorkExperienceForm from "./forms/WorkExperienceForm";
import EducationInfoForm from "./forms/EducationInfoForm";
import SkillsInfoForm from "./forms/SkillsInfoForm";
import SummaryInfoForm from "./forms/SummaryInfoForm";
import DesignForm from "./forms/DesignForm";

export const steps: {
  title: string;
  component: React.ComponentType<EditorFormProps>;
  key: string;
  icon: React.ElementType;
}[] = [
    { title: "General", component: GeneralInfoForm, key: "general-info", icon: Settings },
    { title: "Personal", component: PersonalInfoForm, key: "personal-info", icon: User },
    { title: "Experience", component: WorkExperienceForm, key: "workExperiences-info", icon: Briefcase },
    { title: "Education", component: EducationInfoForm, key: "education-info", icon: GraduationCap },
    { title: "Skills", component: SkillsInfoForm, key: "skills-info", icon: Award },
    { title: "Summary", component: SummaryInfoForm, key: "summary-info", icon: FileText },
    { title: "Design", component: DesignForm, key: "design", icon: LayoutTemplate },
  ];
