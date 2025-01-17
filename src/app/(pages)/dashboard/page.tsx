import { PageHeader } from "~/app/_components/shared/nav/PageHeader";
import AdminCards from "../../_components/cards/AdminCard"

export default function DashboardPage() {
  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard", current: true },
  ];
  return (
      <div className="flex flex-1 flex-col gap-4 pt-0">
                <PageHeader breadcrumbs={breadcrumbs} />
        <AdminCards />
      </div>
  )
}