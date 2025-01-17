"use client"

import { SessionTable } from "~/app/_components/tables/SessionTable";
import { ScrollArea } from "~/components/ui/scroll-area";
import { PageHeader } from "~/app/_components/shared/nav/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { CalendarDays, Users, BookOpen, GraduationCap } from 'lucide-react';

export default function SessionalDetail() {
  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/academics", label: "Academics" },
    { href: "/academics/sessionalDetails", label: "Sessional Details", current: true },
  ];

  const stats = [
    { title: "Active Sessions", value: "3", icon: CalendarDays, color: "text-blue-600" },
    { title: "Total Students", value: "1,234", icon: Users, color: "text-green-600" },
    { title: "Courses Offered", value: "56", icon: BookOpen, color: "text-purple-600" },
    { title: "Graduating Class", value: "120", icon: GraduationCap, color: "text-yellow-600" },
  ];

  return (
    <div className="space-y-6 p-6">
      <PageHeader breadcrumbs={breadcrumbs} />
      <div className="grid gap-4 pt-14 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="transition-all duration-300 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Session Management</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-300px)]">
            <SessionTable />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

