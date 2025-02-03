"use client";

import { ScrollArea } from "~/components/ui/scroll-area";
import { PageHeader } from "~/app/_components/shared/nav/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { CalendarDays, Users, BookOpen, GraduationCap } from "lucide-react";
import { SessionList } from "~/app/_components/(blocks)/SessionList";

export default function SessionFeePage() {
  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/academics", label: "Academics" },
    { href: "/academics/sessionalDetails", label: "Sessional Details", current: true },
  ];

  const stats = [
    { title: "Active Employee", value: "3", icon: CalendarDays, color: "bg-blue-100 text-blue-600" },
    { title: "Total Students", value: "1,234", icon: Users, color: "bg-green-100 text-green-600" },
    { title: "Courses Offered", value: "56", icon: BookOpen, color: "bg-purple-100 text-purple-600" },
    { title: "Revenue", value: "120", icon: GraduationCap, color: "bg-yellow-100 text-yellow-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <PageHeader breadcrumbs={breadcrumbs} />

      <div className="px-6 pt-20">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="flex flex-col justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="flex items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
                <div
                  className={`h-10 w-10 flex items-center justify-center rounded-full ${stat.color}`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>

      {/* Session Management Section */}
      <div className="px-6">
        <Card className="bg-white shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-700">
              Session Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-300px)]">
              <SessionList />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
