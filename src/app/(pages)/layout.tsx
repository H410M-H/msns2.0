import { AppSidebar } from "../_components/shared/sidebar/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 pt-16 px-4">{children}</main>
      </div>
    </div>
  );
}
