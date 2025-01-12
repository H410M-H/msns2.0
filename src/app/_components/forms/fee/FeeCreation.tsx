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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  sessionId: z.string().min(1, "Session is required"),
  classId: z.string().min(1, "Class is required"),
  studentId: z.string().min(1, "Student is required"),
  feeId: z.string().min(1, "Fee name is required"),
});

export function FeeCreationDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const feeData = api.fee.getAllFees.useQuery();
  const sessionData = api.session.getSessions.useQuery();
  const classData = api.class.getClasses.useQuery();
  const studentData = api.student.getStudentsByClassId.useQuery(
    { classId: form.watch("classId") },
    { enabled: !!form.watch("classId") },
  );

  const createFee = api.fee.createFee.useMutation({
    onSuccess: () => {
      toast({
        title: "Fee created successfully",
        description: "The new fee has been added to the system.",
      });
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error creating fee",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // createFee.mutate({
    //   ...values,
    //   tuition: parseFloat(values.tuition),
    // })
    console.log(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Fee</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Fee</DialogTitle>
          <DialogDescription>
            Enter the details for the new fee.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="feeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fees</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={feeData.isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {feeData.data?.map((fee) => (
                        <SelectItem key={fee.feeId} value={fee.feeId}>
                          {fee.feeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sessionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={sessionData.isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select session" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sessionData.data?.map((session) => (
                        <SelectItem
                          key={session.sessionId}
                          value={session.sessionId}
                        >
                          {session.sessionName} ({session.sessionFrom}-
                          {session.sessionTo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!form.watch("sessionId") || classData.isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classData.data?.map((class_) => (
                        <SelectItem key={class_.classId} value={class_.classId}>
                          {class_.grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!form.watch("classId") || studentData.isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {studentData.data?.map((student) => (
                        <SelectItem
                          key={student.studentId}
                          value={student.studentId}
                        >
                          {student.studentName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={createFee.isPending}>
                {createFee.isPending ? "Assigning..." : "Assign Fee"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
