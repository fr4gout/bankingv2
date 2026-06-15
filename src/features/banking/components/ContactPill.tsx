import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Contact } from "../types/banking";
import { maskIban } from "../hooks/useCurrency";

interface ContactPillProps {
  contact: Contact;
  active?: boolean;
  onSelect: (c: Contact) => void;
}

export function ContactPill({ contact, active, onSelect }: ContactPillProps) {
  const initials = contact.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <button
      type="button"
      onClick={() => onSelect(contact)}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition",
        active
          ? "border-[#6BBFFF]/50 bg-[#6BBFFF]/10"
          : "border-white/5 hover:border-[#6BBFFF]/30 hover:bg-white/5",
      )}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
        style={{
          background: `linear-gradient(135deg, hsl(${contact.avatarHue} 70% 45%), hsl(${(contact.avatarHue + 40) % 360} 60% 30%))`,
        }}
      >
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 truncate text-sm font-medium text-white">
          {contact.name}
          {contact.favorite ? <Star className="h-3 w-3 fill-amber-300 text-amber-300" /> : null}
        </div>
        <div className="truncate font-mono text-[10px] uppercase tracking-wider text-white/40">
          {maskIban(contact.iban)}
        </div>
      </div>
    </button>
  );
}
