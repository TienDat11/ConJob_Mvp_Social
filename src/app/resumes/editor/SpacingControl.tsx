"use client";

import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

interface SpacingControlProps {
  spacing: string;
  onChange: (spacing: string) => void;
}

export default function SpacingControl({
  spacing,
  onChange,
}: Readonly<SpacingControlProps>) {
  const options = [
    { id: "generous", name: "Generous", value: "loose" },
    { id: "standard", name: "Standard", value: "normal" },
    { id: "compact", name: "Compact", value: "tight" },
  ];

  const selected = options.find(o => o.value === spacing);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Spacing:</span>
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
