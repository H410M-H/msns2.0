import { ScrollArea } from "@radix-ui/react-scroll-area";
import StudentCreationDialog from "~/app/_components/forms/student/StudentCreation";
import { PageHeader } from "~/app/_components/shared/nav/PageHeader";

export default function StudentRegistration(){
    const breadcrumbs = [
        { href: "/dashboard", label: "Dashboard", },
        { href: "/academics", label: "Academics", },
        { href: "/userReg/student", label: "Student Registration", current: true },
      ]
      
      return (
        <ScrollArea className="items-center ">
          <PageHeader breadcrumbs={breadcrumbs} />
          <div className="pt-14">
            <div className="flex-1">
              <StudentCreationDialog />
            </div>
          </div>
        </ScrollArea>
        )
}
    
