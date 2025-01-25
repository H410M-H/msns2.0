import { ScrollArea } from "~/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { ClassStudentTable } from "~/app/_components/tables/ClassStudent"
import { Suspense } from "react"
import { LoadingSpinner } from "~/app/_components/(blocks)/loading-spinner"
import { PageHeader } from "~/app/_components/shared/nav/PageHeader"

type PageProps = {
  searchParams: Promise<{ classId: string; sessionId: string }>;
};

export default async function ClassDetailsPage({ searchParams }: PageProps) {
  const searchProps = await searchParams;
  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/academics", label: "Academics" },
    { href: "/academics/sessionalDetails", label: "Session Details", current: true },
  ];
  return (
    <div className="space-y-6">
      <PageHeader breadcrumbs={breadcrumbs}/>
      <Card className="mt-6 pt-20">
        <CardHeader>
          <CardTitle>Class Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-300px)]">
            <Suspense fallback={<LoadingSpinner />}>
              <ClassStudentTable classId={searchProps.classId} sessionId={searchProps.sessionId} />
            </Suspense>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

