"use client";

import { cn } from "@/lib/utils";

interface TypingTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function TypingText({ text, className, delay = 500 }: TypingTextProps) {
  return (
    <div className={cn("typing-effect overflow-hidden whitespace-pre-wrap", className)}>
      {text}
    </div>
  );
}
