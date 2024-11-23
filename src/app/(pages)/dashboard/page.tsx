import { SidebarInset } from "~/components/ui/sidebar"
import AdminCards from "../../_components/cards/AdminCard"
import { ScrollArea } from "~/components/ui/scroll-area"
import { PageHeader } from "~/app/_components/shared/nav/PageHeader";

export default function DashboardPage() {
  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/acadamics", label: "Academics" }
  ];

  return (
    <SidebarInset className="flex-1 w-full">
      <PageHeader breadcrumbs={breadcrumbs} />
      <ScrollArea className="flex flex-1 flex-col gap-4 pt-0">
        <AdminCards />
      </ScrollArea>
    </SidebarInset>
  )
}