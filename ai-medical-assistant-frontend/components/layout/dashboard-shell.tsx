import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <div className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-50/80 lg:block">
        <Sidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
