"use client"

import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

interface FontSizeControlProps {
  fontSize?: string;
  onChange: (fontSize: string) => void;
}

export default function FontSizeControl({
  fontSize,
  onChange,
}: Readonly<FontSizeControlProps>) {
  const options = [
    { id: "10px", name: "10px", value: "10px" },
    { id: "11px", name: "11px", value: "11px" },
    { id: "12px", name: "12px", value: "12px" },
  ];
  
  const selected = options.find(o => o.value === fontSize);
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Size:</span>
      {options.map(option => (
        <Button
          key={option.id}
          variant={selected?.id === option.id ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(option.value)}
        >
          {option.name}
        </Button>
      ))}
    </div>
  );
}
