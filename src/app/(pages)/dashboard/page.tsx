import AdminCards from "../../_components/cards/AdminCard"
import { ScrollArea } from "~/components/ui/scroll-area"

export default function DashboardPage() {

  return (
      <ScrollArea className="flex flex-1 flex-col gap-4 pt-0">
        <AdminCards />
      </ScrollArea>
  )
}