"use client"

import { SessionList } from "~/app/_components/tables/SessionList";
import { ScrollArea } from "~/components/ui/scroll-area";
import { PageHeader } from "~/app/_components/shared/nav/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { CalendarDays, Users, BookOpen, GraduationCap } from 'lucide-react';

export default function SessionPage() {
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
    <div className="items-center">
      <PageHeader breadcrumbs={breadcrumbs} />
      <div className="gap-4 pt-14">
      <section className="flex flex-cols mb-8 p-6">
      {stats.map((stat, index) => (
          <Card key={index} className="flex-1 transition-all duration-300 hover:shadow-lg">
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
        </section>
      </div>
        <section className="mb-8 px-6">
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-2xl text-green-700">Session Management</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-300px)]">
            <SessionList />
          </ScrollArea>
        </CardContent>
      </Card>
      </section>
    </div>
  )
}

