import { PageHeader } from "~/app/_components/shared/nav/PageHeader"
import AdminCards from "~/app/_components/cards/AdminCard"
import { StatsCards } from "~/app/_components/cards/StatCard"

export default function DashboardPage() {
  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard", current: true },
  ]
  
  return (
    <div className="items-center">
      <PageHeader breadcrumbs={breadcrumbs} />
      <div className="pt-14">
      {/* Overview Section */}
      <section className="mb-8 p-6">
        <h2 className="text-lg font-semibold text-green-700">Overview</h2>
        <div className="overflow-y-auto max-h-[300px]">
          <StatsCards />
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="mb-8 p-6">
        <h2 className="text-lg font-semibold text-green-700">Quick Actions</h2>
          <AdminCards />
      </section>
    </div>
    </div>
  )
}

