import { AlertTriangle, FileText, Landmark, Zap } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBadge } from "../components/StatusBadge";
import { useBanking } from "../context/BankingContext";
import { formatMoney, formatRelative } from "../hooks/useCurrency";
import type { Invoice } from "../types/banking";

const iconFor = (cat: Invoice["category"]) => {
  switch (cat) {
    case "fine":
      return AlertTriangle;
    case "utility":
      return Zap;
    case "tax":
      return Landmark;
    default:
      return FileText;
  }
};

export function InvoicesView() {
  const { invoices, activeAccount, payInvoice } = useBanking();
  const outstanding = invoices.filter((i) => i.status !== "paid");
  const totalDue = outstanding.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <GlassCard className="lg:col-span-8">
        <SectionHeader title="Invoices & Bills" subtitle="Outstanding charges from government and players" />
        <div className="flex flex-col gap-2">
          {invoices.length === 0 ? (
            <div className="rounded-xl bg-white/5 px-4 py-6 text-center text-sm text-white/40">
              No invoices on file.
            </div>
          ) : (
            invoices.map((inv) => {
              const Icon = iconFor(inv.category);
              const canPay = inv.status !== "paid" && activeAccount.balance >= inv.amount;
              return (
                <div
                  key={inv.id}
                  className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 transition hover:border-[#6BBFFF]/25"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6BBFFF]/10 text-[#6BBFFF]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-sm font-medium text-white">{inv.reason}</div>
                      <StatusBadge status={inv.status} />
                    </div>
                    <div className="truncate text-xs text-white/40">
                      {inv.sender} · {inv.status === "paid" ? "Paid" : `Due ${formatRelative(inv.dueDate)}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-white tabular-nums">
                      {formatMoney(inv.amount)}
                    </div>
                    <button
                      type="button"
                      onClick={() => payInvoice(inv.id)}
                      disabled={!canPay}
                      className="mt-1 inline-flex items-center rounded-md bg-[#6BBFFF] px-2.5 py-1 text-[11px] font-semibold text-[#06121f] transition hover:bg-[#8ccdff] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
                    >
                      {inv.status === "paid" ? "Paid" : "Pay Bill"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </GlassCard>

      <div className="flex flex-col gap-6 lg:col-span-4">
        <GlassCard>
          <div className="text-xs uppercase tracking-widest text-white/40">Total Outstanding</div>
          <div className="mt-2 text-4xl font-semibold tracking-tight text-white">{formatMoney(totalDue)}</div>
          <div className="mt-1 text-xs text-white/40">
            {outstanding.length} unpaid · paying from {activeAccount.name}
          </div>
          <button
            type="button"
            disabled={outstanding.length === 0 || activeAccount.balance < totalDue}
            onClick={() => outstanding.forEach((i) => payInvoice(i.id))}
            className="mt-5 h-11 w-full rounded-xl bg-[#6BBFFF] text-sm font-semibold text-[#06121f] transition hover:bg-[#8ccdff] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
          >
            Pay All
          </button>
        </GlassCard>

        <GlassCard>
          <SectionHeader title="Tip" />
          <p className="text-sm leading-relaxed text-white/60">
            Overdue invoices accrue late fees and can trigger an arrest warrant for outstanding fines.
            Settle overdue bills first.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
