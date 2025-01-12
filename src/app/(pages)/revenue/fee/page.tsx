import { PageHeader } from "~/app/_components/shared/nav/PageHeader";
import { FeeTable } from "~/app/_components/tables/FeeTable";

export default async function FeeDetails(){
  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/revenue", label: "Revenue" },
    { href: "/revenue/fee", label: "Fee Management", current: true },
  ];
  return (
    <main className="min-h-screen bg-yellow-100/50 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <PageHeader breadcrumbs={breadcrumbs} />
      <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Fee Details</h1>
      < FeeTable />
      {/* <ClassFeeTable classId={""} feeId={""} /> */}
    </div>
    </main>
  )
}