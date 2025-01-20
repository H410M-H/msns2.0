"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useToast } from "~/hooks/use-toast";
import { ClassFeeTable } from "../tables/ClassFee";
import { FeeTable } from "../tables/FeeTable";
import { FeeAssignmentDialog } from "../forms/fee/feeAssignment";

type FeeManagementDialogProps = {
  classId?: string;
  sessionId?: string;
};

export function FeeManagementDialog({ classId, sessionId }: FeeManagementDialogProps) {
  const [open, setOpen] = useState(false);

  useToast();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Manage Fees</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[80%]">
        <DialogHeader>
          <DialogTitle>Fee Management</DialogTitle>
          <DialogDescription>
            Manage fees, assign them to students, and view existing assignments.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="manage">
          <TabsList>
            <TabsTrigger value="manage">Manage Fees</TabsTrigger>
            <TabsTrigger value="view">View Assignments</TabsTrigger>
          </TabsList>
          <TabsContent value="manage">
            <div className="space-y-4">
              {classId && sessionId ? (
                <ClassFeeTable classId={classId} sessionId={sessionId} />
              ) : (
                <FeeTable />
              )}
            </div>
          </TabsContent>
          <TabsContent value="view">
            <div className="space-y-4">
              <FeeAssignmentDialog/>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}