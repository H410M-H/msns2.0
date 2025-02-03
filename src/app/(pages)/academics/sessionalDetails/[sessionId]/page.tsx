import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ClassList } from "~/app/_components/(blocks)/ClassList";
import { PageHeader } from "~/app/_components/shared/nav/PageHeader";

type PageProps = {
  params: Promise<{ sessionId: string }>;
};

export default async function SessionDetailPage({ params }: PageProps) {
  const searchProps = await params;
  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/academics", label: "Academics" },
    { href: "/academics/sessionalDetails/class", label: "Class Details", current: true },
  ];
  return (
    <div className="flex-col">
      <PageHeader breadcrumbs={breadcrumbs} />
      <Card className="h-screen border mx-4 py-6 mb-6">
        <CardHeader>
          <CardTitle>Session Detail</CardTitle>
        </CardHeader>
        <CardContent>
            <ClassList sessionId={searchProps.sessionId} />
        </CardContent>
      </Card>
    </div>
  );
}
