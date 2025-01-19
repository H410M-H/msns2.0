import { PageHeader } from "~/app/_components/shared/nav/PageHeader";
import { ClassAlotmentTable } from "~/app/_components/tables/ClassAlotment";
import { Separator } from "~/components/ui/separator";

export default async function ClassStudentPage({
  searchParams,
}: {
  searchParams:  Promise<{ classId: string, sessionId: string }>
}) {
  const searchProps = await searchParams
  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard", current: true },
    { href: "/academics", label: "Academics", current: true },
    { href: "/academics/classSections", label: "Class Sections", current: true },
    { href: "/academics/classSections/classwiseDetail", label: "Classwise Detail", current: true },
  ]
  return (
    <div className="items-center">
      <PageHeader breadcrumbs={breadcrumbs} />
      <div className="pt-14">
      {/* Overview Section */}
      <section className="mb-8 p-6">
        <Separator />
        <h2 className="text-lg font-semibold text-green-700">Add Students to Class</h2>
        <Separator />
        <div className="overflow-y-auto max-h-[300px]">
          <ClassAlotmentTable sessionId={searchProps.sessionId} classId={searchProps.classId} />
        </div>
      </section>
    </div>
    </div>
  );
}
