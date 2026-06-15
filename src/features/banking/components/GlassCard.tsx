import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  inset?: boolean;
}

export function GlassCard({ children, className, inset = false, ...rest }: GlassCardProps) {
  return (
    <div
      {...rest}
      className={cn(
        "relative rounded-2xl border border-[rgba(107,191,255,0.10)] bg-[rgba(14,18,36,0.7)] backdrop-blur-xl",
        "shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]",
        inset ? "p-4" : "p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
