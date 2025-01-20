import { ClassList } from "~/app/_components/(blocks)/ClassList";
import { PageHeader } from "~/app/_components/shared/nav/PageHeader";

export default async function ClassStudentPage({
  searchParams,
}: {
  searchParams:  Promise<{ classId: string, sessionId: string }>
}) {
  const searchProps = await searchParams
  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard", current: true },
    { href: "/academics", label: "Academics", current: true },
    { href: "/academics/classSections/classwiseDetail", label: "Classwise Detail", current: true },
  ]
  return (
    <div className="items-center">
      <PageHeader breadcrumbs={breadcrumbs} />
      <div className="pt-14">
      {/* Overview Section */}
      <section className="mb-8 p-6">
          <ClassList sessionId={searchProps.sessionId} />
      </section>
    </div>
    </div>
  );
}
