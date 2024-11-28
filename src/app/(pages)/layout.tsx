import { AppSidebar } from "../_components/shared/sidebar/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 pt-16">{children}</main>
    </div>
  );
}

