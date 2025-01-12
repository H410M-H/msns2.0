"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { FeeTable } from "../tables/FeeTable"
import { api } from "~/trpc/react"
import { Calendar } from 'lucide-react'
import { SessionCalendar } from "./SessionCalender"

export function FeeManagementDialog() {
  const [open, setOpen] = useState(false)
  const [selectedSessionId] = useState<string | null>(null)
  const [calendarSession, setCalendarSession] = useState<{
    id: string;
    start: Date;
    end: Date;
  } | null>(null)

  const { data: sessions } = api.session.getSessions.useQuery()

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Manage Fees</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[80%]">
          <DialogHeader>
            <DialogTitle>Fee Management</DialogTitle>
            <DialogDescription>
              Manage fees and assign them to students.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold">Sessions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions?.map((session) => (
                  <div
                    key={session.sessionId}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent"
                  >
                    <div>
                      <h4 className="font-medium">{session.sessionName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.sessionFrom).toLocaleDateString()} - {new Date(session.sessionTo).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setCalendarSession({
                          id: session.sessionId,
                          start: new Date(session.sessionFrom),
                          end: new Date(session.sessionTo)
                        })
                      }}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            {selectedSessionId && (
              <FeeTable />
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {calendarSession && (
        <SessionCalendar
          isOpen={!!calendarSession}
          onClose={() => setCalendarSession(null)}
          sessionStart={calendarSession.start}
          sessionEnd={calendarSession.end}
        />
      )}
    </>
  )
}

