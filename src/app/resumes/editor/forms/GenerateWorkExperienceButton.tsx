import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
   GenerateWorkExperienceInput,
   generateWorkExperienceSchema,
   WorkExperience,
 } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { generateWorkExperience } from "./action";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "../LanguageContext";

interface GenerateWorkExperienceButtonProps {
  onWorkExperienceGenerated: (workExperience: WorkExperience) => void;
}

export default function GenerateWorkExperienceButton({
  onWorkExperienceGenerated,
}: Readonly<GenerateWorkExperienceButtonProps>) {
  const { language } = useLanguage();
  const [showInputDialog, setShowInputDialog] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        type="button"
        onClick={() => setShowInputDialog(true)}
      >
        <WandSparklesIcon className="size-4" />
        {language === "vi" ? "Điền thông minh (AI)" : "Smart fill (AI)"}
      </Button>
      <InputDialog
        open={showInputDialog}
        onOpenChange={setShowInputDialog}
        onWorkExperienceGenerated={(workExperience) => {
          onWorkExperienceGenerated(workExperience);
          setShowInputDialog(false);
        }}
      />
    </>
  );
}

interface InputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkExperienceGenerated: (workExperience: WorkExperience) => void;
}

function InputDialog({
  open,
  onOpenChange,
  onWorkExperienceGenerated,
}: Readonly<InputDialogProps>) {
  const { language } = useLanguage();
  const { toast } = useToast();

  const form = useForm<GenerateWorkExperienceInput>({
    resolver: zodResolver(generateWorkExperienceSchema),
    defaultValues: {
      description: "",
    },
  });

  async function onSubmit(input: GenerateWorkExperienceInput) {
    try {
      const response = await generateWorkExperience(input, language);
      onWorkExperienceGenerated(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description:
          language === "vi"
            ? "Đã xảy ra lỗi. Vui lòng thử lại."
            : "Something went wrong. Please try again.",
      });
    }
  }

  const isVi = language === "vi";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isVi ? "Tạo kinh nghiệm làm việc" : "Generate work experience"}
          </DialogTitle>
          <DialogDescription>
            {isVi
              ? "Mô tả kinh nghiệm làm việc này và AI sẽ tạo nội dung được tối ưu hóa cho bạn."
              : "Describe this work experience and the AI will generate an optimized entry for you."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isVi ? "Mô tả" : "Description"}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={
                        isVi
                          ? `VD: "Từ tháng 10/2023 đến tháng 6/2024, tôi làm việc tại Công ty ABC với vai trò Kỹ sư phần mềm. Công việc bao gồm: ..."`
                          : `E.g. "From Oct 2023 to Jun 2024, I worked at Acme Corp as a Software Engineer. My tasks included: ..."`
                      }
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton type="submit" loading={form.formState.isSubmitting}>
              {isVi ? "Tạo" : "Generate"}
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
