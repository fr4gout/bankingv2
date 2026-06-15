import { Bell, ChevronDown, Search } from "lucide-react";
import { useBanking } from "../context/BankingContext";

export function TopBar() {
  const { character, accounts, activeAccount, switchAccount } = useBanking();
  const initials = `${character.firstName[0]}${character.lastName[0]}`;
  const now = new Date().toLocaleString("en-US", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="mb-6 flex items-center gap-4">
      <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-sm text-white/50">
        <Search className="h-4 w-4" />
        <span className="hidden md:inline">Search transactions, contacts…</span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-xs text-white/50 md:block">
          {now}
        </div>

        <div className="relative">
          <select
            value={activeAccount.id}
            onChange={(e) => switchAccount(e.target.value)}
            className="appearance-none rounded-xl border border-white/5 bg-white/[0.03] py-2 pl-3 pr-8 text-sm text-white outline-none transition hover:border-[#6BBFFF]/30"
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id} className="bg-[#0e1224]">
                {a.kind === "society" ? "🏢 " : "👤 "}
                {a.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        </div>

        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] text-white/60 transition hover:text-white"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#6BBFFF] shadow-[0_0_8px_#6BBFFF]" />
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] py-1.5 pl-1.5 pr-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #6BBFFF, #3a4fff)" }}
          >
            {initials}
          </div>
          <div className="text-xs leading-tight">
            <div className="font-medium text-white">
              {character.firstName} {character.lastName}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              #{character.citizenId}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
