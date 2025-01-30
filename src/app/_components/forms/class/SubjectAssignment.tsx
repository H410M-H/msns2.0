"use client";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const formSchema = z.object({
  subjectId: z.string().min(1, "Subject is required"),
  employeeId: z.string().min(1, "Teacher is required"),
  sessionId: z.string().min(1, "Session is required"),
});

export const SubjectAssignmentDialog = ({ classId }: { classId: string }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Type-safe queries
  const subjects = api.subject.getAllSubjects.useQuery();
  const teachers = api.employee.getEmployeesByDesignation.useQuery({ 
    designation: "Teacher" 
  });
  const sessions = api.session.getSessions.useQuery();

  // Type-safe mutation
  const assignSubject = api.subject.assignSubjectToClass.useMutation();

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    assignSubject.mutate({
      classId,
      subjectId: values.subjectId,
      employeeId: values.employeeId,
      sessionId: values.sessionId
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Subject</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Subject to Class</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.data?.map((subject) => (
                        <SelectItem 
                          key={subject.subjectId} 
                          value={subject.subjectId}
                        >
                          {subject.subjectName}
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
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teacher</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.data?.map((teacher) => (
                        <SelectItem 
                          key={teacher.employeeId} 
                          value={teacher.employeeId}
                        >
                          {teacher.employeeName}
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select session" />
                    </SelectTrigger>
                    <SelectContent>
                      {sessions.data?.map((session) => (
                        <SelectItem 
                          key={session.sessionId} 
                          value={session.sessionId}
                        >
                          {session.sessionName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Assign Subject
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};