import { memo } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { EditorFormProps } from "@/lib/types";
import { generalInfoSchema, GeneralInfoValues } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLanguage } from "../LanguageContext";
import { translations } from "../translations";

function GeneralInfoFormComponent({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const form = useForm<GeneralInfoValues>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      title: resumeData.title ?? "",
      description: resumeData.description ?? "",
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
        <h2 className="text-2xl font-semibold">{t.generalInfoTitle}</h2>
        <p className="text-sm text-muted-foreground">
          {t.generalInfoSubtitle}
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.projectName}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t.projectNamePlaceholder} autoFocus />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.description}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t.descriptionPlaceholder} />
                </FormControl>
                <FormDescription>
                  {t.descriptionHint}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}

export default memo(GeneralInfoFormComponent);
