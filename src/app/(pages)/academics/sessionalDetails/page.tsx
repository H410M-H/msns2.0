"use client"

import { SessionTable } from "~/app/_components/tables/SessionTable";
import { ScrollArea } from "~/components/ui/scroll-area";
import { PageHeader } from "~/app/_components/shared/nav/PageHeader";
import { Separator } from "~/components/ui/separator";

export default function sessionalDetail() {
  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/academics", label: "Academics", current: true },
  ];

  return (
    <ScrollArea className="flex flex-1 flex-col gap-6 pt-0">
      <PageHeader breadcrumbs={breadcrumbs} />
      <div className="container mx-auto pt-16 px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-white shadow-md rounded-lg">
          {/* Decorative Header */}
          <div className="relative bg-gradient-to-r from-green-600 to-yellow-500 p-6 rounded-t-lg">
            <h1 className="text-center font-serif text-5xl font-bold tracking-tight text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-100 to-yellow-300">
                Student Allotment
              </span>
            </h1>
          </div>
          {/* Separator with animation */}
          <Separator className="bg-green-900 my-4" />
          {/* Content Section */}
          <div className="px-6 py-4">
            <p className="text-center text-gray-600 text-lg">
              Manage and view student allotments seamlessly.
            </p>
            <div className="mt-6">
              <SessionTable />
            </div>
          </div>
          {/* Bottom Animated Border */}
          <div className="absolute bottom-0 left-0 h-1 w-full origin-left transform scale-x-0 bg-gradient-to-r from-green-600 to-yellow-500 transition-transform duration-300 group-hover:scale-x-100"></div>
        </div>
      </div>
    </ScrollArea>
  )
}
