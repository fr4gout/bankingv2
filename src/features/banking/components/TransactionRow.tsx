import { ArrowDownLeft, ArrowUpRight, Briefcase, FileText, ReceiptText, ShoppingBag, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMoneySigned, formatRelative } from "../hooks/useCurrency";
import type { Transaction } from "../types/banking";

const negativeTypes: Transaction["type"][] = ["withdraw", "transfer_out", "invoice", "purchase"];

const iconFor: Record<Transaction["type"], React.ComponentType<{ className?: string }>> = {
  deposit: Wallet,
  withdraw: ArrowUpRight,
  transfer_in: ArrowDownLeft,
  transfer_out: ArrowUpRight,
  invoice: FileText,
  salary: Briefcase,
  purchase: ShoppingBag,
};

export function TransactionRow({ tx }: { tx: Transaction }) {
  const negative = negativeTypes.includes(tx.type);
  const signed = (negative ? -1 : 1) * tx.amount;
  const Icon = iconFor[tx.type] ?? ReceiptText;

  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/5">
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          negative ? "bg-rose-500/10 text-rose-300" : "bg-emerald-500/10 text-emerald-300",
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-white">{tx.label}</div>
        <div className="truncate text-xs text-white/40">
          {tx.counterparty ?? "—"} · {formatRelative(tx.timestamp)}
        </div>
      </div>
      <div className={cn("text-sm font-semibold tabular-nums", negative ? "text-white" : "text-emerald-400")}>
        {formatMoneySigned(signed)}
      </div>
    </div>
  );
}
