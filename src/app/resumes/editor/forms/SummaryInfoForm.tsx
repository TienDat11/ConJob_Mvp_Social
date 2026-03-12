import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { EditorFormProps } from "@/lib/types";
import { summarySchema, SummaryValues } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import GenerateSummaryButton from "./GenerateSummaryButton";
import { useLanguage } from "../LanguageContext";
import { translations } from "../translations";

export default function SummaryInfoForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const form = useForm<SummaryValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: resumeData.summary || "",
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({ ...resumeData, ...values });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">{t.summaryTitle}</h2>
        <p className="text-sm text-muted-foreground">
          {t.summarySubtitle}
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">{t.summaryLabel}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={t.summaryPlaceholder}
                  />
                </FormControl>
                <FormMessage />
                <GenerateSummaryButton
                  resumeData={resumeData}
                  onSummaryGenerated={(summary) =>
                    form.setValue("summary", summary)
                  }
                />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
