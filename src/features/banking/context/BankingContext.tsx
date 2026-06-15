import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { BankingState, Transaction, ViewKey } from "../types/banking";
import { seedState } from "../mock/seed";
import { fetchNui, useNuiEvent } from "../nui/bridge";

interface BankingContextValue extends BankingState {
  activeAccount: BankingState["accounts"][number];
  setView: (v: ViewKey) => void;
  close: () => void;
  switchAccount: (id: string) => void;
  deposit: (amount: number) => void;
  withdraw: (amount: number) => void;
  transfer: (args: { toIban: string; amount: number; note?: string; contactName?: string }) => void;
  payInvoice: (id: string) => void;
}

const BankingContext = createContext<BankingContextValue | null>(null);

const uid = () => `tx_${Math.random().toString(36).slice(2, 10)}`;

export function BankingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BankingState>(seedState);

  useNuiEvent<boolean>("setVisible", (visible) => {
    setState((s) => ({ ...s, isVisible: !!visible }));
  });

  const pushTx = useCallback((tx: Transaction) => {
    setState((s) => ({ ...s, transactions: [tx, ...s.transactions] }));
  }, []);

  const setView = useCallback((v: ViewKey) => setState((s) => ({ ...s, view: v })), []);

  const close = useCallback(() => {
    setState((s) => ({ ...s, isVisible: false }));
    void fetchNui("close");
  }, []);

  const switchAccount = useCallback((id: string) => {
    setState((s) => ({ ...s, activeAccountId: id }));
    void fetchNui("switchAccount", { id });
  }, []);

  const deposit = useCallback(
    (amount: number) => {
      if (amount <= 0) return;
      setState((s) => {
        if (amount > s.cashOnHand) return s;
        return {
          ...s,
          cashOnHand: s.cashOnHand - amount,
          accounts: s.accounts.map((a) =>
            a.id === s.activeAccountId ? { ...a, balance: a.balance + amount } : a,
          ),
          transactions: [
            { id: uid(), accountId: s.activeAccountId, type: "deposit", amount, label: "Cash Deposit", counterparty: "Branch", timestamp: Date.now() },
            ...s.transactions,
          ],
        };
      });
      void fetchNui("deposit", { amount });
    },
    [],
  );

  const withdraw = useCallback(
    (amount: number) => {
      if (amount <= 0) return;
      setState((s) => {
        const acc = s.accounts.find((a) => a.id === s.activeAccountId);
        if (!acc || amount > acc.balance) return s;
        return {
          ...s,
          cashOnHand: s.cashOnHand + amount,
          accounts: s.accounts.map((a) =>
            a.id === s.activeAccountId ? { ...a, balance: a.balance - amount } : a,
          ),
          transactions: [
            { id: uid(), accountId: s.activeAccountId, type: "withdraw", amount, label: "ATM Withdrawal", counterparty: "Branch", timestamp: Date.now() },
            ...s.transactions,
          ],
        };
      });
      void fetchNui("withdraw", { amount });
    },
    [],
  );

  const transfer = useCallback(
    ({ toIban, amount, note, contactName }: { toIban: string; amount: number; note?: string; contactName?: string }) => {
      if (amount <= 0) return;
      setState((s) => {
        const acc = s.accounts.find((a) => a.id === s.activeAccountId);
        if (!acc || amount > acc.balance) return s;
        return {
          ...s,
          accounts: s.accounts.map((a) =>
            a.id === s.activeAccountId ? { ...a, balance: a.balance - amount } : a,
          ),
          transactions: [
            {
              id: uid(),
              accountId: s.activeAccountId,
              type: "transfer_out",
              amount,
              label: contactName ? `To ${contactName}` : `To ${toIban}`,
              counterparty: contactName ?? toIban,
              note,
              timestamp: Date.now(),
            },
            ...s.transactions,
          ],
        };
      });
      void fetchNui("transfer", { toIban, amount, note });
    },
    [],
  );

  const payInvoice = useCallback((id: string) => {
    setState((s) => {
      const invoice = s.invoices.find((i) => i.id === id);
      const acc = s.accounts.find((a) => a.id === s.activeAccountId);
      if (!invoice || invoice.status === "paid" || !acc || acc.balance < invoice.amount) return s;
      return {
        ...s,
        accounts: s.accounts.map((a) =>
          a.id === s.activeAccountId ? { ...a, balance: a.balance - invoice.amount } : a,
        ),
        invoices: s.invoices.map((i) => (i.id === id ? { ...i, status: "paid" } : i)),
        transactions: [
          {
            id: uid(),
            accountId: s.activeAccountId,
            type: "invoice",
            amount: invoice.amount,
            label: `${invoice.sender} — ${invoice.reason}`,
            counterparty: invoice.sender,
            timestamp: Date.now(),
          },
          ...s.transactions,
        ],
      };
    });
    void fetchNui("payInvoice", { id });
  }, []);

  const value = useMemo<BankingContextValue>(() => {
    const activeAccount =
      state.accounts.find((a) => a.id === state.activeAccountId) ?? state.accounts[0];
    return {
      ...state,
      activeAccount,
      setView,
      close,
      switchAccount,
      deposit,
      withdraw,
      transfer,
      payInvoice,
    };
  }, [state, setView, close, switchAccount, deposit, withdraw, transfer, payInvoice]);

  // pushTx is part of context surface only via NUI events; expose via window for debugging
  if (typeof window !== "undefined") {
    (window as unknown as { __bankingPushTx?: typeof pushTx }).__bankingPushTx = pushTx;
  }

  return <BankingContext.Provider value={value}>{children}</BankingContext.Provider>;
}

export function useBanking() {
  const ctx = useContext(BankingContext);
  if (!ctx) throw new Error("useBanking must be used within BankingProvider");
  return ctx;
}
