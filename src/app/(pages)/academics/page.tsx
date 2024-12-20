import { ScrollArea } from "~/components/ui/scroll-area"
import { PageHeader } from "~/app/_components/shared/nav/PageHeader";
import AcademicCards from "~/app/_components/cards/AcademicCard";

export default function AcademicsPage() {
  const breadcrumbs = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard"},
    { href: "/academics", label: "Academics", current: true },
  ];


  return (
    <ScrollArea className="flex flex-1 flex-col gap-4 pt-0">
    <PageHeader breadcrumbs={breadcrumbs} />
      <AcademicCards />
    </ScrollArea>

  )
}