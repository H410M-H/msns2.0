import { AppSidebar } from "../_components/shared/sidebar/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1">
        <main className="pt-16">{children}</main>
      </div>
    </div>
  );
}
