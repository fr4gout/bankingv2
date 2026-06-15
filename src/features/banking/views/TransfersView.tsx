import { useMemo, useState } from "react";
import { Send, ShieldCheck } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { SectionHeader } from "../components/SectionHeader";
import { ContactPill } from "../components/ContactPill";
import { useBanking } from "../context/BankingContext";
import { formatMoney } from "../hooks/useCurrency";
import type { Contact } from "../types/banking";

const IBAN_RE = /^LS\d{2}(?:\s?\d{4}){3}$/i;

export function TransfersView() {
  const { contacts, activeAccount, transfer } = useBanking();
  const [iban, setIban] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState<Contact | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const amountNum = Number(amount.replace(/[^\d.]/g, "")) || 0;
  const ibanValid = IBAN_RE.test(iban.trim());
  const amountValid = amountNum > 0 && amountNum <= activeAccount.balance;
  const noteValid = note.length <= 60;
  const formValid = ibanValid && amountValid && noteValid;

  const sortedContacts = useMemo(
    () => [...contacts].sort((a, b) => Number(b.favorite ?? false) - Number(a.favorite ?? false)),
    [contacts],
  );

  const pick = (c: Contact) => {
    setSelected(c);
    setIban(c.iban);
  };

  const submit = () => {
    if (!formValid) return;
    transfer({ toIban: iban.trim(), amount: amountNum, note, contactName: selected?.name });
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 2200);
    setAmount("");
    setNote("");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <GlassCard className="lg:col-span-8">
        <SectionHeader
          title="Wire Transfer"
          subtitle={`Sending from ${activeAccount.name} · ${formatMoney(activeAccount.balance)} available`}
          action={
            <div className="flex items-center gap-1.5 text-xs text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" /> Encrypted
            </div>
          }
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label>Recipient IBAN</Label>
            <input
              value={iban}
              onChange={(e) => {
                setIban(e.target.value);
                setSelected(null);
              }}
              placeholder="LS00 0000 0000 0000"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm tracking-wider text-white outline-none transition focus:border-[#6BBFFF]/50"
            />
            {iban && !ibanValid ? <Hint tone="danger">IBAN format: LS## #### #### ####</Hint> : null}
          </div>

          <div>
            <Label>Amount</Label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
              <span className="text-white/40">$</span>
              <input
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="flex-1 bg-transparent text-lg font-semibold text-white outline-none"
              />
            </div>
            {amount && !amountValid ? (
              <Hint tone="danger">
                {amountNum <= 0 ? "Enter an amount" : "Exceeds available balance"}
              </Hint>
            ) : null}
          </div>

          <div>
            <Label>Purpose (optional)</Label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's this for?"
              maxLength={80}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-[#6BBFFF]/50"
            />
            <Hint>{60 - note.length} characters left</Hint>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-[#6BBFFF]/15 bg-[#6BBFFF]/5 p-4">
          <div className="text-xs text-white/60">
            {selected ? (
              <>
                Sending to <span className="text-white">{selected.name}</span>
              </>
            ) : (
              "Verify recipient details before sending."
            )}
          </div>
          <button
            type="button"
            disabled={!formValid}
            onClick={submit}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#6BBFFF] px-5 text-sm font-semibold text-[#06121f] transition hover:bg-[#8ccdff] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
            Send {amountNum > 0 ? formatMoney(amountNum) : ""}
          </button>
        </div>
        {confirmed ? (
          <div className="mt-3 rounded-lg bg-emerald-500/10 px-4 py-2 text-xs text-emerald-300">
            Transfer sent successfully.
          </div>
        ) : null}
      </GlassCard>

      <GlassCard className="lg:col-span-4">
        <SectionHeader title="Recent Contacts" subtitle="Tap to autofill recipient" />
        <div className="flex flex-col gap-2">
          {sortedContacts.map((c) => (
            <ContactPill
              key={c.id}
              contact={c}
              active={selected?.id === c.id}
              onSelect={pick}
            />
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="mb-1.5 text-[11px] font-medium uppercase tracking-widest text-white/40">{children}</div>;
}
function Hint({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "danger" }) {
  return (
    <div className={tone === "danger" ? "mt-1.5 text-xs text-rose-300" : "mt-1.5 text-xs text-white/35"}>
      {children}
    </div>
  );
}
