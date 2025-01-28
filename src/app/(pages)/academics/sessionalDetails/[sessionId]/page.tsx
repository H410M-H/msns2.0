import { ScrollArea } from "~/components/ui/scroll-area";
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
    <div className="flex">
      <PageHeader breadcrumbs={breadcrumbs} />
      <Card>
        <CardHeader>
          <CardTitle>Session Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-screen w-auto">
            <ClassList sessionId={searchProps.sessionId} classId={searchProps.sessionId} />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
