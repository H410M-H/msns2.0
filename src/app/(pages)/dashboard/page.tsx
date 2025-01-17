import { PageHeader } from "~/app/_components/shared/nav/PageHeader"
import AdminCards from "~/app/_components/cards/AdminCard"
import { StatsCards } from "~/app/_components/cards/StatCard"

export default function DashboardPage() {
  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard", current: true },
  ]
  
  return (
    <div className="flex flex-col gap-8">
      <PageHeader breadcrumbs={breadcrumbs} />
      <div className="p-6">
      {/* Overview Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Overview</h2>
        <div className="overflow-y-auto max-h-[300px]">
          <StatsCards />
        </div>
      </section>

      {/* Quick Actions Section */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <AdminCards />
      </section>
    </div>
    </div>
  )
}

