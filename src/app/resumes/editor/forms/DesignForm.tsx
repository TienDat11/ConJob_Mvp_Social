import { EditorFormProps } from "@/lib/types";

import { Label } from "@/components/ui/label";
import ColorPicker from "../ColorPicker";
import BorderStyleButton from "../BorderStyleButton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutTemplate, Check } from "lucide-react";

export default function DesignForm({
    resumeData,
    setResumeData,
}: EditorFormProps) {

    return (
        <div className="space-y-6 mx-auto max-w-xl">
            <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-semibold">Design & Style</h2>
                <p className="text-sm text-muted-foreground">
                    Customize the look and feel of your resume.
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <Label className="text-base font-semibold">Color Theme</Label>
                    <div className="flex items-center gap-3 mt-2">
                        <ColorPicker
                            color={resumeData.colorHex || "#000000"}
                            onChange={(color) =>
                                setResumeData({ ...resumeData, colorHex: color.hex })
                            }
                        />
                        <span className="text-sm text-muted-foreground">
                            Picked: {resumeData.colorHex || "Black"}
                        </span>
                    </div>
                </div>

                <div>
                    <Label className="text-base font-semibold">Photo Border</Label>
                    <div className="flex items-center gap-3 mt-2">
                        <BorderStyleButton
                            borderStyle={resumeData.borderStyle || "squircle"}
                            onChange={(style) =>
                                setResumeData({ ...resumeData, borderStyle: style })
                            }
                        />
                    </div>
                </div>

                <div>
                    <Label className="text-base font-semibold">Layout</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                        <button
                            type="button"
                            onClick={() => setResumeData({ ...resumeData, layout: "classic" })}
                            className={cn(
                                "flex flex-col items-center gap-2 border-2 rounded-xl p-4 transition-all hover:bg-secondary/50",
                                resumeData.layout === "classic" || !resumeData.layout ? "border-primary bg-secondary/50" : "border-border"
                            )}
                        >
                            <div className="w-full aspect-[210/297] bg-white shadow-sm border p-2 flex flex-col gap-2 pointer-events-none transform scale-75 origin-top">
                                <div className="h-4 w-1/3 bg-gray-200 rounded" />
                                <div className="h-2 w-full bg-gray-100 rounded" />
                                <div className="h-2 w-full bg-gray-100 rounded" />
                                <div className="mt-auto h-16 w-full bg-gray-50 rounded-sm" />
                            </div>
                            <div className="flex items-center gap-2 font-medium">
                                {(resumeData.layout === "classic" || !resumeData.layout) && <Check className="size-4 text-primary" />}
                                Classic
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setResumeData({ ...resumeData, layout: "modern" })}
                            className={cn(
                                "flex flex-col items-center gap-2 border-2 rounded-xl p-4 transition-all hover:bg-secondary/50",
                                resumeData.layout === "modern" ? "border-primary bg-secondary/50" : "border-border"
                            )}
                        >
                            <div className="w-full aspect-[210/297] bg-white shadow-sm border flex pointer-events-none transform scale-75 origin-top">
                                <div className="w-1/3 bg-gray-800 h-full p-2 space-y-2">
                                    <div className="size-8 rounded-full bg-white/20" />
                                    <div className="h-2 w-full bg-white/20 rounded" />
                                    <div className="h-2 w-1/2 bg-white/20 rounded" />
                                </div>
                                <div className="w-2/3 p-2 space-y-2">
                                    <div className="h-4 w-1/3 bg-gray-200 rounded" />
                                    <div className="h-2 w-full bg-gray-100 rounded" />
                                    <div className="h-2 w-full bg-gray-100 rounded" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 font-medium">
                                {resumeData.layout === "modern" && <Check className="size-4 text-primary" />}
                                Modern
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setResumeData({ ...resumeData, layout: "professional" })}
                            className={cn(
                                "flex flex-col items-center gap-2 border-2 rounded-xl p-4 transition-all hover:bg-secondary/50",
                                resumeData.layout === "professional" ? "border-primary bg-secondary/50" : "border-border"
                            )}
                        >
                            <div className="w-full aspect-[210/297] bg-white shadow-sm border flex flex-col pointer-events-none transform scale-75 origin-top">
                                <div className="bg-gray-100 h-8 w-full p-1 flex items-center gap-2 mb-2">
                                    <div className="size-6 rounded bg-gray-300" />
                                    <div className="w-16 h-2 bg-gray-300 rounded" />
                                </div>
                                <div className="p-2 space-y-2 grid grid-cols-[2fr_1fr] gap-2 h-full">
                                    <div className="space-y-1">
                                        <div className="h-2 w-full bg-gray-100 rounded" />
                                        <div className="h-2 w-full bg-gray-100 rounded" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="h-2 w-full bg-gray-100 rounded" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 font-medium">
                                {resumeData.layout === "professional" && <Check className="size-4 text-primary" />}
                                Professional
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setResumeData({ ...resumeData, layout: "minimalist" })}
                            className={cn(
                                "flex flex-col items-center gap-2 border-2 rounded-xl p-4 transition-all hover:bg-secondary/50",
                                resumeData.layout === "minimalist" ? "border-primary bg-secondary/50" : "border-border"
                            )}
                        >
                            <div className="w-full aspect-[210/297] bg-white shadow-sm border p-4 flex flex-col items-center pt-8 gap-4 pointer-events-none transform scale-75 origin-top">
                                <div className="h-4 w-1/2 bg-gray-800 rounded mb-2" />
                                <div className="w-full space-y-2">
                                    <div className="h-px w-full bg-gray-200" />
                                    <div className="grid grid-cols-[1fr_3fr] gap-2 w-full">
                                        <div className="h-2 bg-gray-200 rounded" />
                                        <div className="h-2 bg-gray-100 rounded" />
                                    </div>
                                    <div className="grid grid-cols-[1fr_3fr] gap-2 w-full">
                                        <div className="h-2 bg-gray-200 rounded" />
                                        <div className="h-2 bg-gray-100 rounded" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 font-medium">
                                {resumeData.layout === "minimalist" && <Check className="size-4 text-primary" />}
                                Minimalist
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
