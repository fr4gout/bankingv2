import { useState } from "react";
import { cn } from "@/lib/utils";

interface AmountInputProps {
  max?: number;
  onSubmit: (amount: number) => void;
  cta: string;
  tone?: "accent" | "danger";
  quick?: number[];
  placeholder?: string;
}

export function AmountInput({
  max,
  onSubmit,
  cta,
  tone = "accent",
  quick = [100, 500, 1000, 5000],
  placeholder = "0",
}: AmountInputProps) {
  const [raw, setRaw] = useState("");

  const value = Number(raw.replace(/[^\d.]/g, "")) || 0;
  const invalid = value <= 0 || (max !== undefined && value > max);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 rounded-xl border border-[rgba(107,191,255,0.14)] bg-black/30 px-4 py-3">
        <span className="text-white/40">$</span>
        <input
          inputMode="decimal"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-xl font-semibold text-white outline-none placeholder:text-white/25"
        />
        {max !== undefined ? (
          <button
            type="button"
            onClick={() => setRaw(String(max))}
            className="rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#6BBFFF] hover:bg-[#6BBFFF]/10"
          >
            Max
          </button>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {quick.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => setRaw(String(q))}
            className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 transition hover:border-[#6BBFFF]/40 hover:text-white"
          >
            ${q.toLocaleString()}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={invalid}
        onClick={() => {
          onSubmit(value);
          setRaw("");
        }}
        className={cn(
          "group relative h-11 overflow-hidden rounded-xl text-sm font-semibold tracking-wide transition disabled:cursor-not-allowed disabled:opacity-40",
          tone === "accent" && "bg-[#6BBFFF] text-[#06121f] hover:bg-[#8ccdff]",
          tone === "danger" && "border border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20",
        )}
      >
        {cta}
      </button>
    </div>
  );
}
