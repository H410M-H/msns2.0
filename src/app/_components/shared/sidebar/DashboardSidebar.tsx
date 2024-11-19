"use client"

import * as React from "react"
import { AudioWaveform, BookOpen, Bot, ChevronRight, ChevronsUpDown, Command, Frame, GalleryVerticalEnd, Settings2, SquareTerminal } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
} from "~/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/01.png",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp",
      logo: AudioWaveform,
      plan: "Pro",
    },
    {
      name: "Acme LLC",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
  ],
}

export default function DashboardSidebar() {
  const [activeTeam, setActiveTeam] = React.useState<(typeof data.teams)[0] | null>(data.teams[0] ?? null);

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      {activeTeam && <activeTeam.logo className="size-4" />}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{activeTeam?.name ?? 'Select Team'}</span>
                      <span className="truncate text-xs">{activeTeam?.plan ?? 'No plan'}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]" align="start">
                  <DropdownMenuLabel>Teams</DropdownMenuLabel>
                  {data.teams.map((team) => (
                    <DropdownMenuItem key={team.name} onClick={() => setActiveTeam(team)}>
                      <div className="flex size-6 items-center justify-center rounded-md border">
                        <team.logo className="size-4" />
                      </div>
                      <span className="ml-2">{team.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible key={item.title} defaultOpen={item.isActive}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                        {item.items?.length > 0 && (
                          <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {item.items?.length > 0 && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <a href={subItem.url}>{subItem.title}</a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarMenu>
              {data.projects.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild tooltip={item.name}>
                    <a href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="size-8 rounded-lg">
                      <AvatarImage src={data.user.avatar} alt={data.user.name} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{data.user.name}</span>
                      <span className="truncate text-xs">{data.user.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width]"
                  align="start"
                  sideOffset={4}
                >
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  )
}