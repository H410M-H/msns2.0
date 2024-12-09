"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  Map,
  PieChart,
  School,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";

// This is sample data.
const data = {
  user: {
    name: "msns",
    email: "admin@msns.edu.pk",
    avatar: "favicon.ico",
  },
  teams: [
    {
      id: "1", // Add the missing id
      name: "Admin",
      logo: School,
      plan: "Enterprise",
    },
    {
      id: "2", // Add the missing id
      name: "Faculty",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      id: "3", // Add the missing id
      name: "Student",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Greetings", url: "/dashboard" },
        { title: "Analytics", url: "/dashboard" },
        { title: "Profile", url: "/dashboard" },
      ],
    },
    {
      title: "Academics",
      url: "/academics",
      icon: Bot,
      items: [
        { title: "Session", url: "/academics/sessionalDetails" },
        { title: "Classes", url: "/academics/classwiseDetail" },
        { title: "Students", url: "/userReg/faculty/view" },
      ],
    },
    {
      title: "Registration Portal",
      url: "/userReg",
      icon: BookOpen,
      items: [
        { title: "Faculty", url: "/userReg/faculty/create" },
        { title: "Students", url: "/userReg/student/create" },
        // { title: "Tutorials", url: "#" },
        // { title: "Changelog", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
        { title: "Limits", url: "#" },
      ],
    },
  ],
  projects: [
    { name: "Design Engineering", url: "#", icon: Frame },
    { name: "Sales & Marketing", url: "#", icon: PieChart },
    { name: "Travel", url: "#", icon: Map },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="absolute top-16">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}


