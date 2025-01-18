import { ScrollArea } from "@radix-ui/react-scroll-area";
import { PageHeader } from "~/app/_components/shared/nav/PageHeader";
import { StudentTable } from "~/app/_components/tables/StudentTable";

export default function StudentsTable() {
    const breadcrumbs = [
        { href: "/dashboard", label: "Dashboard", },
        { href: "/academics", label: "Academics", },
        { href: "/userReg/student", label: "Registered Students", current: true },
      ]
      
      return (
        <ScrollArea className="items-center ">
          <PageHeader breadcrumbs={breadcrumbs} />
          <div className="pt-16">
            <div className="flex-1 p-4">
                <StudentTable />
            </div>
            </div>
        </ScrollArea>
    )
}
