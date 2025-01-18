import { ScrollArea } from "~/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ClassFeeTable } from "~/app/_components/tables/ClassFee";

type PageProps = {
  searchParams: Promise<{ classId: string; sessionId: string }>;
};

export default async function FeeDetailsPage({ searchParams }: PageProps) {
  const paramProps = await searchParams;
  return (
    <div className="space-y-6">
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Fee details</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-300px)]">
            <ClassFeeTable sessionId={paramProps.sessionId} classId={paramProps.classId} />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
