"use client";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ClassTable } from "../tables/ClassTable";
import { RegistrationCards } from "../cards/RegistrationCard";
import { api } from "~/trpc/react";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { CalendarDays, Users, BookOpen, Calculator } from "lucide-react";
import { FeeTable } from "../tables/FeeTable";
import { SessionCalendar } from "./SessionCalender";

interface SessionDetailDialogProps {
  sessionId: string;
  isActive: boolean;
}

export function SessionDialog({ sessionId, isActive }: SessionDetailDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const utils = api.useUtils();

  const { data: session } = api.session.getSessions.useQuery(undefined, {
    select: (sessions) => sessions.find((s) => s.sessionId === sessionId),
  });

  const setActiveSession = api.session.setActiveSession.useMutation({
    onSuccess: async (_data, _variables: { sessionId: string }) => {
      try {
        // Re-fetch active session to confirm update
        const activeSession = api.session.getActiveSession as unknown as {
          sessionId: string;
        };
        const previousInput = { sessionId: _variables.sessionId }; // Declare and assign previousInput
        if (!activeSession || activeSession.sessionId !== previousInput.sessionId) {
          // Handle conflict (e.g., show error message)
          console.error("Failed to set active session due to conflict");
          // Revert UI change (optional)
        }
      } catch (error) {
        console.error("Error fetching active session:", error);
        // Revert UI change (optional)
      } finally {
        // Invalidate relevant queries to ensure data consistency
        await utils.session.getSessions.invalidate();
        await utils.session.getActiveSession.invalidate();
      }
    },
  });

  const handleSetActive = () => {
    setActiveSession.mutate({ sessionId });
  };

  const tabs = [
    {
      id: "calendar",
      label: "Calendar",
      icon: CalendarDays,
      content: session && (
        <SessionCalendar
          sessionStart={new Date(session.sessionFrom)}
          sessionEnd={new Date(session.sessionTo)}
        />
      ),
    },
    {
      id: "registration",
      label: "Registration",
      icon: Users,
      content: <RegistrationCards />,
    },
    {
      id: "classes",
      label: "Classes",
      icon: BookOpen,
      content: <ClassTable sessionId={sessionId} />,
    },
    {
      id: "fees",
      label: "Fees",
      icon: Calculator,
      content: <FeeTable />,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2">
          <CalendarDays className="h-4 w-14" />
          View Details
          {isActive && (
            <Badge variant="secondary" className="ml-auto">
              Active
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{session?.sessionName}</DialogTitle>
            {!isActive && (
              <Button
                variant="outline"
                onClick={handleSetActive}
                disabled={setActiveSession.status === "pending"}
              >
                Set as Active
              </Button>
            )}
          </div>
        </DialogHeader>
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="border-none p-0 pt-4"
            >
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}