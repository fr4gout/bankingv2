import { Banknote, TrendingUp, Wallet } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { MetricTile } from "../components/MetricTile";
import { DebitCard } from "../components/DebitCard";
import { AmountInput } from "../components/AmountInput";
import { TransactionRow } from "../components/TransactionRow";
import { SectionHeader } from "../components/SectionHeader";
import { useBanking } from "../context/BankingContext";
import { formatMoney } from "../hooks/useCurrency";

export function DashboardView() {
  const { activeAccount, cashOnHand, transactions, character, deposit, withdraw } = useBanking();
  const total = activeAccount.balance + cashOnHand;
  const recent = transactions.filter((t) => t.accountId === activeAccount.id).slice(0, 5);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Hero metric */}
      <GlassCard className="lg:col-span-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-white/40">Total Wealth</div>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-5xl font-semibold tracking-tight text-white">
                  {formatMoney(total)}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300">
                  <TrendingUp className="h-3 w-3" /> +2.4% this week
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 border-t border-white/5 pt-6">
            <MetricTile
              label="Bank Balance"
              value={formatMoney(activeAccount.balance)}
              delta={activeAccount.name}
              icon={<Banknote className="h-3.5 w-3.5" />}
            />
            <MetricTile
              label="Cash on Hand"
              value={formatMoney(cashOnHand)}
              delta="Wallet"
              icon={<Wallet className="h-3.5 w-3.5" />}
            />
          </div>
        </div>
      </GlassCard>

      {/* Debit card */}
      <div className="lg:col-span-4">
        <DebitCard
          holderName={`${character.firstName} ${character.lastName}`}
          iban={activeAccount.iban}
          balance={formatMoney(activeAccount.balance)}
        />
      </div>

      {/* Quick actions */}
      <GlassCard className="lg:col-span-4">
        <SectionHeader title="Quick Deposit" subtitle="Move cash on hand into your account" />
        <AmountInput cta="Deposit" max={cashOnHand} onSubmit={deposit} />
      </GlassCard>

      <GlassCard className="lg:col-span-4">
        <SectionHeader title="Quick Withdraw" subtitle="Pull cash from your active account" />
        <AmountInput cta="Withdraw" tone="danger" max={activeAccount.balance} onSubmit={withdraw} />
      </GlassCard>

      {/* Recent activity */}
      <GlassCard className="lg:col-span-4">
        <SectionHeader title="Recent Activity" subtitle="Last 5 transactions" />
        <div className="flex flex-col gap-1">
          {recent.length === 0 ? (
            <div className="rounded-xl bg-white/5 px-4 py-6 text-center text-sm text-white/40">
              No activity yet.
            </div>
          ) : (
            recent.map((tx) => <TransactionRow key={tx.id} tx={tx} />)
          )}
        </div>
      </GlassCard>
    </div>
  );
}
