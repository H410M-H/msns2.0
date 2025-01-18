import { ScrollArea } from "~/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ClassList } from "~/app/_components/(blocks)/ClassList";

type PageProps = {
  params: Promise<{ sessionId: string }>;
};

export default async function SessionDetailPage({ params }: PageProps) {
  const searchProps = await params;
  return (
    <div className="space-y-6 p-6">
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Session Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-300px)]">
            <ClassList sessionId={searchProps.sessionId} />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
