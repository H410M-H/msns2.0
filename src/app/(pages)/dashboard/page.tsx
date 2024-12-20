import { PageHeader } from "~/app/_components/shared/nav/PageHeader";
import AdminCards from "../../_components/cards/AdminCard"
import { ScrollArea } from "~/components/ui/scroll-area"

export default function DashboardPage() {
  const breadcrumbs = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard", current: true },
  ];
  return (
      <ScrollArea className="flex flex-1 flex-col gap-4 pt-0">
                <PageHeader breadcrumbs={breadcrumbs} />
        <AdminCards />
      </ScrollArea>
  )
}