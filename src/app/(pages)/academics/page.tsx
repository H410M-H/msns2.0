import { SidebarInset } from "~/components/ui/sidebar"
import { ScrollArea } from "~/components/ui/scroll-area"
import { PageHeader } from "~/app/_components/shared/nav/PageHeader";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { AcademicCards } from "~/app/_components/cards/AcademicCard";
import { SessionCards } from "~/app/_components/cards/SessionCard";

export default function AcademicsPage() {

    const breadcrumbs = [
      { href: "/acadamics", label: "Academics" },
      { href: "/dashboard", label: "Dashboard" }
  ];

  return (
    <SidebarInset className="flex-1 w-full">
      <PageHeader breadcrumbs={breadcrumbs} />
      <ScrollArea className="flex flex-1 flex-col gap-4 pt-0">
    <main className="min-h-screen sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-4 xl:grid-cols-4 bg-yellow-100/50">
      <div className="relative overflow-hidden pt-20">
        <Separator className="bg-green-900" />
        <h1 className="text-center text-5xl font-serif font-bold tracking-tight p-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-yellow-500 hover:from-orange-400 hover:to-green-500 transition-all duration-300">
            Academics Management
          </span>
        </h1>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-600 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left">
        </div>
      </div>
        <Separator className="bg-green-900 my-4" />
        <div className="flex-cols-4 gap-6 lg:gap-8 justify-center items-center">
          <AcademicCards />
        </div>
        <Separator className="bg-green-900 my-4" />
        <div className="flex-cols-4 gap-6 lg:gap-8 justify-center items-center">
          <SessionCards />
        </div>
        <Separator className="bg-green-900 my-4" />
    </main>
      </ScrollArea>
    </SidebarInset>
  )
}