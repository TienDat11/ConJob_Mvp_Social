import { memo } from "react";
import { useEffect } from "react";
import { useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripHorizontal, Trash2 } from "lucide-react";

import { EditorFormProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  workExperienceSchema,
  WorkExperienceValues,
} from "@/lib/validation";
import type { WorkExperienceItem } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import GenerateWorkExperienceButton from "./GenerateWorkExperienceButton";
import { useLanguage } from "../LanguageContext";
import { translations } from "../translations";

function WorkExperienceFormComponent({
  resumeData,
  setResumeData,
}: Readonly<EditorFormProps>) {
  const { language } = useLanguage();
  const t = translations[language];

  const form = useForm<WorkExperienceValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      workExperiences: resumeData.workExperiences || [],
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData((prev) => ({
        ...prev,
        workExperiences:
          values.workExperiences?.filter(
            (item): item is WorkExperienceItem => Boolean(item),
          ) ?? [],
      }));
    });
    return unsubscribe;
  }, [form, setResumeData]);

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "workExperiences",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        move(oldIndex, newIndex);
      }
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">{t.workExperienceTitle}</h2>
        <p className="text-sm text-muted-foreground">
          {t.workExperienceSubtitle}
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext items={fields} strategy={verticalListSortingStrategy}>
              {fields.map((field, index) => (
                <WorkExperienceItem
                  id={field.id}
                  key={field.id}
                  index={index}
                  form={form}
                  remove={remove}
                />
              ))}
            </SortableContext>
          </DndContext>
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={() =>
                append({
                  position: "",
                  company: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                })
              }
            >
              {t.addWorkExperience}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

interface WorkExperienceItemProps {
  id: string;
  form: UseFormReturn<WorkExperienceValues>;
  index: number;
  remove: (index: number) => void;
}

function WorkExperienceItem({
  id,
  form,
  index,
  remove,
}: Readonly<WorkExperienceItemProps>) {
  const { language } = useLanguage();
  const t = translations[language];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      className={cn(
        "space-y-3 rounded-md border bg-background p-3",
        isDragging && "relative z-50 cursor-grab shadow-xl",
      )}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripHorizontal
            className="size-5 cursor-grab text-muted-foreground focus:outline-none"
            {...attributes}
            {...listeners}
          />
          <span className="font-semibold">{t.workExperienceItem} {index + 1}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => remove(index)}
          title={t.removeWorkExperience}
        >
          <Trash2 className="size-5 text-destructive" />
        </Button>
      </div>
      <div className="flex-1 space-y-3">
        <FormField
          control={form.control}
          name={`workExperiences.${index}.position` as const}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.jobTitleLabel}</FormLabel>
              <FormControl>
                <Input {...field} autoFocus />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`workExperiences.${index}.company` as const}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.company}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name={`workExperiences.${index}.startDate` as const}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.startDate}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="date"
                    value={field.value?.slice(0, 10)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`workExperiences.${index}.endDate` as const}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.endDate}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="date"
                    value={field.value?.slice(0, 10)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name={`workExperiences.${index}.description` as const}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.descriptionLabel}</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <GenerateWorkExperienceButton
            onWorkExperienceGenerated={(exp) => {
              form.setValue(
                `workExperiences.${index}.position` as const,
                exp.position || "",
              );
              form.setValue(
                `workExperiences.${index}.company` as const,
                exp.company || "",
              );
              form.setValue(
                `workExperiences.${index}.startDate` as const,
                exp.startDate || "",
              );
              form.setValue(
                `workExperiences.${index}.endDate` as const,
                exp.endDate || "",
              );
              form.setValue(
                `workExperiences.${index}.description` as const,
                exp.description || "",
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(WorkExperienceFormComponent);
