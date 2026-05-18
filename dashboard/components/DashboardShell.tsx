import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardShellProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function DashboardShell({
  children,
  title,
  description,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-neutral-50 text-neutral-900">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto p-8 md:p-12">
        <header className="mb-10 border-b border-neutral-200 pb-8">
          <h1 className="text-2xl font-light tracking-tight">{title}</h1>
          {description && (
            <p className="mt-2 text-sm text-neutral-500">{description}</p>
          )}
        </header>
        {children}
      </main>
    </div>
  );
}
