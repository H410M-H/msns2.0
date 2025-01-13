import { AppSidebar } from "../_components/shared/sidebar/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="overflow-auto flex min-h-screen">
      <AppSidebar />
      <div className="flex-1">
        <main className="pt-16">{children}</main>
      </div>
    </div>
  );
}
