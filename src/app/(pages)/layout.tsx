import { AppSidebar } from "../_components/shared/sidebar/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AppSidebar />
      {/* Main Content */}
      <main className="flex-1 bg-white p-6 pt-24 md:p-10 md:pt-28">
        {children}
      </main>
    </div>
  );
}