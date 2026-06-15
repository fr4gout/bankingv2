import { BankingProvider, useBanking } from "./context/BankingContext";
import { CanvasFrame } from "./layout/CanvasFrame";
import { Sidebar } from "./layout/Sidebar";
import { TopBar } from "./layout/TopBar";
import { DashboardView } from "./views/DashboardView";
import { TransfersView } from "./views/TransfersView";
import { AccountsView } from "./views/AccountsView";
import { InvoicesView } from "./views/InvoicesView";

function Inner() {
  const { view, isVisible } = useBanking();
  if (!isVisible) return null;

  return (
    <CanvasFrame>
      <div className="flex flex-1 gap-6">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="flex-1">
            {view === "dashboard" && <DashboardView />}
            {view === "transfers" && <TransfersView />}
            {view === "accounts" && <AccountsView />}
            {view === "invoices" && <InvoicesView />}
          </main>
        </div>
      </div>
    </CanvasFrame>
  );
}

export function BankingApp() {
  return (
    <BankingProvider>
      <Inner />
    </BankingProvider>
  );
}
