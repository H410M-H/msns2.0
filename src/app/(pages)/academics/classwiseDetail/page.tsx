
import { PageHeader } from "~/app/_components/shared/nav/PageHeader";
import { ClassFeeTable } from "~/app/_components/tables/ClassFee";

type PageProps = {
  params: Promise<{
    sfcid: string; classId: string, sessionId: string 
}>;
};
export default async function ClassDetailPage({ params }: PageProps) {
  const searchProps = await params;
  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard", current: true },
    { href: "/academics", label: "Academics", current: true },
    { href: "/academics/classwiseDetail", label: "Classwise Detail", current: true },
  ]
  return (
    <div className="items-center">
      <PageHeader breadcrumbs={breadcrumbs} />
      <div className="pt-14">
      {/* Overview Section */}
      <section className="mb-8 p-6">
        <ClassFeeTable sessionId={searchProps.sessionId} classId={searchProps.classId} />
      </section>
    </div>
    </div>
  );
}
