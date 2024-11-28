import AdminCards from "../../_components/cards/AdminCard"
import { ScrollArea } from "~/components/ui/scroll-area"
import { PageHeader } from "~/app/_components/shared/nav/PageHeader";

export default function DashboardPage() {
  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/acadamics", label: "Academics" }
  ];

  return (
      <ScrollArea className="flex flex-1 flex-col gap-4 pt-0">
      <PageHeader breadcrumbs={breadcrumbs} />
        <AdminCards />
      </ScrollArea>
  )
}