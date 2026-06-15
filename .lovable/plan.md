
# FiveM Premium Banking NUI — Plan

A single-page (multi-view) NUI dashboard built on the existing TanStack Start + Tailwind v4 stack. All views are rendered inside one fixed game-canvas frame, switched via internal state (not URL routes) so it mirrors how a FiveM NUI resource actually works. Mock data drives everything so it previews cleanly in the browser, with a thin NUI bridge ready for drop-in to a FiveM resource.

## Folder & File Architecture

```text
src/
├── routes/
│   └── index.tsx                      # Mounts <BankingApp/> inside the NUI canvas frame
│
├── styles.css                         # Add banking tokens: --bg #060810, --accent #6BBFFF,
│                                      # --surface rgba(14,18,36,0.7), --hairline rgba(107,191,255,0.1)
│                                      # plus --gradient-accent, --shadow-glow
│
├── features/banking/
│   ├── BankingApp.tsx                 # Top-level shell: sidebar + active view switcher
│   │
│   ├── context/
│   │   └── BankingContext.tsx         # Provider + useBanking() hook
│   │                                  # Holds: character, balances, transactions, accounts,
│   │                                  # contacts, invoices, activeView, isVisible
│   │                                  # Actions: deposit, withdraw, transfer, payInvoice,
│   │                                  # switchAccount, setView, close
│   │
│   ├── types/
│   │   └── banking.ts                 # Character, Account (personal|society), Transaction,
│   │                                  # Contact, Invoice, ViewKey, NuiMessage, NuiAction
│   │
│   ├── mock/
│   │   └── seed.ts                    # Realistic seed: character, 2 personal + 2 society
│   │                                  # accounts, ~20 transactions, contacts, invoices
│   │
│   ├── nui/
│   │   └── bridge.ts                  # GetParentResourceName() shim, fetchNui<T>(action,data),
│   │                                  # useNuiEvent(action, handler) — safe in browser preview
│   │
│   ├── layout/
│   │   ├── CanvasFrame.tsx            # Fixed 1600x900-ish centered frame, scales to viewport
│   │   ├── Sidebar.tsx                # Vertical nav, lucide icons, active indicator, close btn
│   │   └── TopBar.tsx                 # Character name, account switcher pill, time/server tag
│   │
│   ├── components/
│   │   ├── GlassCard.tsx              # Reusable surface: backdrop-blur + hairline border
│   │   ├── DebitCard.tsx              # Animated 3D-tilt virtual card (chip, masked PAN, name)
│   │   ├── MetricTile.tsx             # Hero metric block (label, value, delta)
│   │   ├── AmountInput.tsx            # Numeric input + quick chips (100/500/1k/max) + slider
│   │   ├── TransactionRow.tsx         # Income/expense row w/ icon, merchant, amount, time
│   │   ├── ContactPill.tsx            # Recent contact avatar pill for quick transfer
│   │   ├── StatusBadge.tsx            # Paid / Overdue / Pending pill
│   │   └── SectionHeader.tsx          # Title + optional action
│   │
│   ├── views/
│   │   ├── DashboardView.tsx          # Hero wealth split, DebitCard, Quick Deposit/Withdraw,
│   │   │                              # Recent Activity (last 5)
│   │   ├── TransfersView.tsx          # Wire transfer form (IBAN, amount, note) + validation
│   │   │                              # + Recent Contacts strip + confirmation modal
│   │   ├── AccountsView.tsx           # Tabs: Personal | Society. Society shows limits,
│   │   │                              # authorized ranks, members snapshot
│   │   └── InvoicesView.tsx           # Ledger of fines/player invoices, Pay Bill action
│   │
│   └── hooks/
│       ├── useCurrency.ts             # Format $ amounts, signed deltas
│       └── useTransactions.ts         # Filter/sort/paginate transaction lists
│
└── components/ui/...                  # Existing shadcn primitives reused (button, input,
                                       # tabs, dialog, slider, scroll-area, badge, separator)
```

## View Composition

- **Dashboard**: 12-col grid → left: hero MetricTile (Total Wealth, split into Bank + Cash) and Recent Activity feed; right: DebitCard + Quick Deposit / Quick Withdraw stacked panels.
- **Transfers**: 2-col → left: transfer form with inline validation (target IBAN format, amount ≤ balance, note ≤ 60 chars), confirm dialog; right: Recent Contacts vertical list + favorite toggles.
- **Accounts**: Tabs (Personal / Society). Society cards show role, withdraw limit, deposit limit, last activity. Switching account updates dashboard context.
- **Invoices**: Table-style ledger with status badges, sender, reason, due date, amount, single-click Pay (deducts from active account, logs transaction, marks paid).

## State Model (BankingContext)

```ts
{
  character: { id, firstName, lastName, citizenId, phone },
  accounts: Account[],                 // personal + society
  activeAccountId: string,
  cashOnHand: number,
  transactions: Transaction[],         // newest first
  contacts: Contact[],
  invoices: Invoice[],
  view: 'dashboard'|'transfers'|'accounts'|'invoices',
  isVisible: boolean,
}
```

Actions are pure local-state in browser preview; each also calls `fetchNui(action, payload)` so wiring into a real FiveM resource is a no-op swap.

## NUI Bridge (`nui/bridge.ts`)

- `getResourceName()` → `window.GetParentResourceName?.() ?? 'banking-ui'`
- `fetchNui<T>(action, data)` → POST to `https://${resource}/${action}`; in browser preview, resolves with mock echo so the UI never breaks.
- `useNuiEvent(action, handler)` → registers `window.addEventListener('message', …)` with cleanup; dispatches by `data.action`. Supports actions: `setVisible`, `setCharacter`, `setAccounts`, `pushTransaction`, `pushInvoice`.

## Design System Additions (src/styles.css)

Add tokens under `:root` and map in `@theme inline`:
- `--background: oklch(...)` for `#060810`
- `--accent` / `--accent-foreground` for `#6BBFFF`
- `--surface`, `--surface-foreground`, `--hairline`
- `--gradient-accent`, `--shadow-glow`, `--radius` bumped to 1rem
Glass surfaces use `bg-surface/70 backdrop-blur-xl border border-[--hairline]` (no hand-written `-webkit-` prefixes).

## Implementation Order

1. Tokens in `styles.css` + `CanvasFrame` + `BankingApp` shell wired into `routes/index.tsx`.
2. Types, mock seed, `BankingContext`, NUI bridge (browser-safe).
3. Sidebar + TopBar + view switcher.
4. Shared components (`GlassCard`, `DebitCard`, `MetricTile`, `AmountInput`, `TransactionRow`, etc.).
5. Views in order: Dashboard → Transfers → Accounts → Invoices.
6. Polish: hover/press micro-interactions, card tilt, number count-up on balance changes.
7. README snippet in `features/banking/nui/bridge.ts` header documenting expected server events.

## Out of Scope (for this pass)

- Real FiveM Lua side / server resource files.
- Auth, persistence, routing per view (single-route NUI by design).
- Charts library — keep visualizations as lightweight CSS bars/sparklines unless you ask for Recharts.

Awaiting approval to build.
