"use client"

import * as React from "react"
import { Book, Bot, School, SquareTerminal, User, Users } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "~/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import { cn } from "~/lib/utils"

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
    },
    {
      title: "Alumni",
      url: "/userReg/faculty/edit",
      icon: Users,
    },
    {
      title: "Academics",
      url: "/academics",
      icon: Book,
      items: [
        { title: "Session", url: "/academics/sessionalDetails" },
        { title: "Classes", url: "/academics/sessionalDetails/[sessionId]" },
        { title: "Students", url: "/userReg/student/view" },
      ],
    },
    {
      title: "Registeration",
      url: "/userReg",
      icon: Bot,
      items: [
        { title: "Students", url: "/userReg/student/create" },
        { title: "Employees", url: "/userReg/faculty/create" },
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
  ],
}

export function AppSidebar({ className }: { className?: string }) {
  const { isMobile } = useSidebar()

  return (
    <Sidebar 
      collapsible={isMobile ? "offcanvas" : "icon"} 
      variant="inset"
      className={cn("flex h-auto top-16 z-40 shadow-lg", className)}
    >
      <SidebarHeader className="pb-2">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      
      <SidebarContent className="flex-1 overflow-y-auto">
        <NavMain items={data.navMain} />
      </SidebarContent>
      
      <SidebarFooter className="border-t bg-sidebar-accent/10">
        <NavUser />
      </SidebarFooter>
      
      <SidebarRail className="hover:after:bg-primary/50" />
    </Sidebar>
  )
}

