import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/components/ui/use-toast";
import { ResumeValues } from "@/lib/validation";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { generateSummary } from "./action";
import { useLanguage } from "../LanguageContext";

interface GenerateSummaryButtonProps {
  resumeData: ResumeValues;
  onSummaryGenerated: (summary: string) => void;
}

export default function GenerateSummaryButton({
  resumeData,
  onSummaryGenerated,
}: Readonly<GenerateSummaryButtonProps>) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);
      const aiResponse = await generateSummary(resumeData, language);
      onSummaryGenerated(aiResponse);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description:
          language === "vi"
            ? "Đã xảy ra lỗi. Vui lòng thử lại."
            : "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoadingButton
      variant="outline"
      type="button"
      onClick={handleClick}
      loading={loading}
    >
      <WandSparklesIcon className="size-4" />
      {language === "vi" ? "Tạo bằng AI" : "Generate (AI)"}
    </LoadingButton>
  );
}
