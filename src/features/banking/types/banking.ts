export type ViewKey = "dashboard" | "transfers" | "accounts" | "invoices";

export interface Character {
  id: string;
  firstName: string;
  lastName: string;
  citizenId: string;
  phone: string;
}

export type AccountKind = "personal" | "society";

export interface Account {
  id: string;
  kind: AccountKind;
  name: string;
  iban: string;
  balance: number;
  /** Society-only */
  role?: string;
  withdrawLimit?: number;
  depositLimit?: number;
  members?: number;
  authorizedRanks?: string[];
}

export type TxType = "deposit" | "withdraw" | "transfer_in" | "transfer_out" | "invoice" | "salary" | "purchase";

export interface Transaction {
  id: string;
  accountId: string;
  type: TxType;
  amount: number; // positive number, sign derived from type
  label: string;
  counterparty?: string;
  note?: string;
  timestamp: number;
}

export interface Contact {
  id: string;
  name: string;
  iban: string;
  avatarHue: number; // 0-360 for gradient avatar
  favorite?: boolean;
}

export type InvoiceStatus = "unpaid" | "paid" | "overdue";

export interface Invoice {
  id: string;
  sender: string;
  reason: string;
  amount: number;
  dueDate: number;
  status: InvoiceStatus;
  category: "fine" | "player" | "utility" | "tax";
}

export interface BankingState {
  character: Character;
  accounts: Account[];
  activeAccountId: string;
  cashOnHand: number;
  transactions: Transaction[];
  contacts: Contact[];
  invoices: Invoice[];
  view: ViewKey;
  isVisible: boolean;
}
