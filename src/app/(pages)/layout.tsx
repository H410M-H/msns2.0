import { SidebarProvider } from "~/components/ui/sidebar"
import { AppSidebar } from "../_components/shared/sidebar/app-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex pt-20">
        <AppSidebar />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </SidebarProvider>
  )
}