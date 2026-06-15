import { useState } from "react";
import { Building2, ChevronRight, ShieldCheck, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "../components/GlassCard";
import { SectionHeader } from "../components/SectionHeader";
import { useBanking } from "../context/BankingContext";
import { formatMoney, maskIban } from "../hooks/useCurrency";
import type { Account, AccountKind } from "../types/banking";

export function AccountsView() {
  const { accounts, activeAccountId, switchAccount } = useBanking();
  const [tab, setTab] = useState<AccountKind>("personal");
  const list = accounts.filter((a) => a.kind === tab);

  return (
    <GlassCard>
      <SectionHeader
        title="Accounts"
        subtitle="Personal accounts and society / business ledgers"
        action={
          <div className="flex rounded-xl border border-white/5 bg-black/30 p-1">
            <TabBtn active={tab === "personal"} onClick={() => setTab("personal")}>
              <User className="h-3.5 w-3.5" /> Personal
            </TabBtn>
            <TabBtn active={tab === "society"} onClick={() => setTab("society")}>
              <Building2 className="h-3.5 w-3.5" /> Society
            </TabBtn>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {list.map((a) => (
          <AccountCard
            key={a.id}
            account={a}
            active={a.id === activeAccountId}
            onSelect={() => switchAccount(a.id)}
          />
        ))}
      </div>
    </GlassCard>
  );
}

function TabBtn({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
        active ? "bg-[#6BBFFF]/15 text-white" : "text-white/50 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

function AccountCard({ account, active, onSelect }: { account: Account; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-5 text-left transition",
        active
          ? "border-[#6BBFFF]/50 bg-[#6BBFFF]/[0.06]"
          : "border-white/5 bg-white/[0.02] hover:border-[#6BBFFF]/30 hover:bg-white/[0.04]",
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40">
            {account.kind === "society" ? <Building2 className="h-3 w-3" /> : <User className="h-3 w-3" />}
            {account.kind}
          </div>
          <div className="mt-1 text-base font-semibold text-white">{account.name}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/40">
            {maskIban(account.iban)}
          </div>
        </div>
        <ChevronRight className={cn("h-5 w-5 transition", active ? "text-[#6BBFFF]" : "text-white/30")} />
      </div>

      <div className="mt-5">
        <div className="text-[10px] uppercase tracking-widest text-white/40">Balance</div>
        <div className="text-3xl font-semibold tracking-tight text-white">{formatMoney(account.balance)}</div>
      </div>

      {account.kind === "society" ? (
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/5 pt-4 text-xs">
          <Meta label="Your Role" value={account.role ?? "—"} />
          <Meta label="Members" value={`${account.members ?? 0}`} icon={<Users className="h-3 w-3" />} />
          <Meta label="Withdraw Limit" value={account.withdrawLimit ? formatMoney(account.withdrawLimit) : "—"} />
          <Meta label="Deposit Limit" value={account.depositLimit ? formatMoney(account.depositLimit) : "—"} />
          {account.authorizedRanks?.length ? (
            <div className="col-span-2">
              <div className="mb-1.5 text-[10px] uppercase tracking-widest text-white/40">Authorized Ranks</div>
              <div className="flex flex-wrap gap-1.5">
                {account.authorizedRanks.map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center gap-1 rounded-full border border-[#6BBFFF]/20 bg-[#6BBFFF]/10 px-2 py-0.5 text-[10px] font-medium text-[#9fd4ff]"
                  >
                    <ShieldCheck className="h-3 w-3" />
                    {r}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </button>
  );
}

function Meta({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/40">
        {icon}
        {label}
      </div>
      <div className="mt-0.5 text-sm font-medium text-white">{value}</div>
    </div>
  );
}
