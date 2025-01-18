import { PageHeader } from "~/app/_components/shared/nav/PageHeader";
import { ScrollArea } from "~/components/ui/scroll-area"
import { RevenueCards } from "~/app/_components/cards/RevenueCard";

export default function RevenuePage() {
    const breadcrumbs = [
        { href: "/dashboard", label: "Dashboard"},
        { href: "/revenue", label: "Revenue", current: true },
      ];
  return (
      <ScrollArea className="flex flex-1 flex-col gap-4">
                <PageHeader breadcrumbs={breadcrumbs} />
        <RevenueCards />
      </ScrollArea>
  )
}