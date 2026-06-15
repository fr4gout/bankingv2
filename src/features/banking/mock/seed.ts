import type { Account, BankingState, Contact, Invoice, Transaction } from "../types/banking";

const now = Date.now();
const mins = (n: number) => now - n * 60_000;
const hrs = (n: number) => now - n * 3_600_000;
const days = (n: number) => now - n * 86_400_000;

const accounts: Account[] = [
  {
    id: "acc_personal_main",
    kind: "personal",
    name: "Personal Checking",
    iban: "LS00 4421 8893 1207",
    balance: 184_520,
  },
  {
    id: "acc_personal_savings",
    kind: "personal",
    name: "Savings",
    iban: "LS00 8821 5530 4419",
    balance: 62_300,
  },
  {
    id: "acc_society_lspd",
    kind: "society",
    name: "Los Santos Police Department",
    iban: "LS00 0001 0911 0000",
    balance: 1_240_750,
    role: "Sergeant",
    withdrawLimit: 25_000,
    depositLimit: 250_000,
    members: 42,
    authorizedRanks: ["Chief", "Captain", "Sergeant"],
  },
  {
    id: "acc_society_mechanic",
    kind: "society",
    name: "Bennys Motorworks",
    iban: "LS00 0044 2210 5511",
    balance: 318_900,
    role: "Owner",
    withdrawLimit: 100_000,
    depositLimit: 500_000,
    members: 8,
    authorizedRanks: ["Owner", "Manager"],
  },
];

const transactions: Transaction[] = [
  { id: "t1", accountId: "acc_personal_main", type: "salary", amount: 4_500, label: "LSPD Paycheck", counterparty: "Government", timestamp: hrs(2) },
  { id: "t2", accountId: "acc_personal_main", type: "purchase", amount: 89, label: "Burger Shot", counterparty: "Burger Shot", timestamp: hrs(5) },
  { id: "t3", accountId: "acc_personal_main", type: "transfer_in", amount: 2_500, label: "From Michael DeSanta", counterparty: "M. DeSanta", note: "Poker debt", timestamp: hrs(9) },
  { id: "t4", accountId: "acc_personal_main", type: "withdraw", amount: 1_200, label: "ATM Withdrawal", counterparty: "Pacific Bank ATM", timestamp: hrs(14) },
  { id: "t5", accountId: "acc_personal_main", type: "purchase", amount: 320, label: "Premium Deluxe Motorsport", counterparty: "PDM", timestamp: hrs(20) },
  { id: "t6", accountId: "acc_personal_main", type: "transfer_out", amount: 750, label: "To Trevor Philips", counterparty: "T. Philips", note: "Rent", timestamp: days(1) },
  { id: "t7", accountId: "acc_personal_main", type: "deposit", amount: 6_000, label: "Cash Deposit", counterparty: "Branch", timestamp: days(1) },
  { id: "t8", accountId: "acc_personal_main", type: "invoice", amount: 450, label: "Speeding fine", counterparty: "LSPD", timestamp: days(2) },
  { id: "t9", accountId: "acc_personal_main", type: "salary", amount: 4_500, label: "LSPD Paycheck", counterparty: "Government", timestamp: days(2) },
  { id: "t10", accountId: "acc_personal_main", type: "purchase", amount: 27, label: "24/7 Convenience", counterparty: "24/7", timestamp: days(3) },
];

const contacts: Contact[] = [
  { id: "c1", name: "Michael DeSanta", iban: "LS00 1122 0044 8821", avatarHue: 210, favorite: true },
  { id: "c2", name: "Franklin Clinton", iban: "LS00 5567 8090 1144", avatarHue: 140, favorite: true },
  { id: "c3", name: "Trevor Philips", iban: "LS00 9981 4422 0055", avatarHue: 30 },
  { id: "c4", name: "Lester Crest", iban: "LS00 6612 7741 0088", avatarHue: 280 },
  { id: "c5", name: "Lamar Davis", iban: "LS00 3322 9985 4400", avatarHue: 100 },
];

const invoices: Invoice[] = [
  { id: "i1", sender: "LSPD", reason: "Speeding (90 in 45)", amount: 850, dueDate: days(-3), status: "unpaid", category: "fine" },
  { id: "i2", sender: "City Hall", reason: "Property Tax — Eclipse Towers", amount: 3_200, dueDate: days(-7), status: "unpaid", category: "tax" },
  { id: "i3", sender: "LS Power", reason: "Electricity — March", amount: 412, dueDate: days(-1), status: "overdue", category: "utility" },
  { id: "i4", sender: "Bennys Motorworks", reason: "Tuning & respray", amount: 12_500, dueDate: days(-5), status: "unpaid", category: "player" },
  { id: "i5", sender: "LSPD", reason: "Illegal parking", amount: 150, dueDate: days(10), status: "paid", category: "fine" },
];

export const seedState: BankingState = {
  character: {
    id: "char_001",
    firstName: "Alex",
    lastName: "Mercer",
    citizenId: "ABC12345",
    phone: "555-0142",
  },
  accounts,
  activeAccountId: "acc_personal_main",
  cashOnHand: 3_450,
  transactions,
  contacts,
  invoices,
  view: "dashboard",
  isVisible: true,
};
