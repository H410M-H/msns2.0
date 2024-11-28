import { ScrollArea } from "~/components/ui/scroll-area"
import { PageHeader } from "~/app/_components/shared/nav/PageHeader";
import SessionCards from "~/app/_components/cards/SessionCard";

export default function AcademicsPage() {

    const breadcrumbs = [
      { href: "/acadamics", label: "Academics" },
      { href: "/dashboard", label: "Dashboard" }
  ];

  return (
    <ScrollArea className="flex flex-1 flex-col gap-4 pt-0">
    <PageHeader breadcrumbs={breadcrumbs} />
      <SessionCards />
    </ScrollArea>

  )
}