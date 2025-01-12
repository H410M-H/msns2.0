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
import { ClassFeeTable } from "../tables/ClassFee"

type FeeManagementDialogProps = {
  classId?: string
  sessionId?: string
}

export function FeeManagementDialog({ classId, sessionId }: FeeManagementDialogProps) {
  const [open, setOpen] = useState(false)

  return (
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
          {classId && sessionId ? (
            <ClassFeeTable classId={classId} sessionId={sessionId} />
          ) : (
            <FeeTable />
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

