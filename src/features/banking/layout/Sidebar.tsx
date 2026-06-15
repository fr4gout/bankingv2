import { ArrowLeftRight, Building2, LayoutDashboard, LogOut, ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBanking } from "../context/BankingContext";
import type { ViewKey } from "../types/banking";

const items: { key: ViewKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "dashboard", label: "Overview", icon: LayoutDashboard },
  { key: "transfers", label: "Transfers", icon: ArrowLeftRight },
  { key: "accounts", label: "Accounts", icon: Building2 },
  { key: "invoices", label: "Invoices", icon: ReceiptText },
];

export function Sidebar() {
  const { view, setView, close } = useBanking();
  return (
    <aside className="flex w-[220px] shrink-0 flex-col gap-2 rounded-2xl border border-[rgba(107,191,255,0.10)] bg-[rgba(14,18,36,0.6)] p-3 backdrop-blur-xl">
      <div className="px-3 py-4">
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#06121f]"
            style={{ background: "linear-gradient(135deg, #6BBFFF, #3677ff)" }}
          >
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Pacific</div>
            <div className="text-[10px] uppercase tracking-widest text-white/40">Standard Bank</div>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map((it) => {
          const Icon = it.icon;
          const active = it.key === view;
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => setView(it.key)}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active ? "bg-[#6BBFFF]/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white",
              )}
            >
              {active ? (
                <span
                  aria-hidden
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#6BBFFF] shadow-[0_0_18px_#6BBFFF]"
                />
              ) : null}
              <Icon className={cn("h-4 w-4", active ? "text-[#6BBFFF]" : "")} />
              <span>{it.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={close}
        className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/50 transition hover:bg-rose-500/10 hover:text-rose-300"
      >
        <LogOut className="h-4 w-4" />
        Close
      </button>
    </aside>
  );
}
