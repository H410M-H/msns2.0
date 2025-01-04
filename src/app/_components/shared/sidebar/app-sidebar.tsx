"use client"

import * as React from "react"
import { Bot, School, Settings2, SquareTerminal, User } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"

const data = {
  teams: [
    {
      id: "1",
      name: "Admin",
      logo: School,
      plan: "Enterprise",
    }
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Overview", url: "/dashboard" },
        { title: "Analytics", url: "/dashboard/analytics" },
      ],
    },
    {
      title: "Academics",
      url: "/academics",
      icon: Bot,
      items: [
        { title: "Session", url: "/academics/sessionalDetails" },
        { title: "Classes", url: "/academics/classwiseDetail" },
        { title: "Students", url: "/userReg/student/view" },
      ],
    },
    {
      title: "Account",
      url: "/account",
      icon: User,
      items: [
        { title: "Profile", url: "/account" },
        { title: "Settings", url: "/account" },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        { title: "General", url: "/settings/general" },
        { title: "Security", url: "/settings/security" },
        { title: "Notifications", url: "/settings/notifications" },
      ],
    },
  ],
  // projects: [
  //   { name: "Design Engineering", url: "#", icon: Frame },
  //   { name: "Sales & Marketing", url: "#", icon: PieChart },
  //   { name: "Travel", url: "#", icon: Map },
  // ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="absolute  top-16">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

