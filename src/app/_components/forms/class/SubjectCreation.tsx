"use client";

import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { BookUploader } from "../../(blocks)/docUploader";

const formSchema = z.object({
  mode: z.enum(["create", "assign"]),
  subjectName: z.string().optional(),
  book: z.string().optional(),
  description: z.string().optional(),
  subjectId: z.string().optional(),
  employeeId: z.string().optional(),
  sessionId: z.string().optional(),
}).refine(data => {
  if (data.mode === "create") {
    return z.object({
      subjectName: z.string().min(2),
      employeeId: z.string().min(1),
      sessionId: z.string().min(1),
    }).safeParse(data);
  }
  return z.object({
    subjectId: z.string().min(1),
    employeeId: z.string().min(1),
    sessionId: z.string().min(1),
  }).safeParse(data);
});

export const SubjectCreationDialog = ({ classId }: { classId: string }) => {
  const [mode, setMode] = useState<"create" | "assign">("create");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mode: "create",
      subjectName: "",
      book: "",
      description: "",
      subjectId: "",
      employeeId: "",
      sessionId: "",
    },
  });

  const utils = api.useUtils();
  const subjects = api.subject.getAllSubjects.useQuery();
  const teachers = api.employee.getEmployeesByDesignation.useQuery({ 
    designation: "Teacher" 
  });
  const sessions = api.session.getSessions.useQuery();

  const createSubject = api.subject.createSubject.useMutation();
  const assignSubject = api.subject.assignSubjectToClass.useMutation();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (mode === "create") {
        const newSubject = await createSubject.mutateAsync({
          subjectName: values.subjectName!,
          book: values.book,
          description: values.description,
        });
        
        await assignSubject.mutateAsync({
          classId,
          subjectId: newSubject.subjectId,
          employeeId: values.employeeId!,
          sessionId: values.sessionId!,
        });
      } else {
        await assignSubject.mutateAsync({
          classId,
          subjectId: values.subjectId!,
          employeeId: values.employeeId!,
          sessionId: values.sessionId!,
        });
      }

      form.reset();
      await Promise.all([
        utils.subject.getAllSubjects.invalidate(),
        utils.subject.getSubjectsByClass.invalidate({ classId }),
      ]);
    } catch (error) {
      console.error("Operation failed:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Manage Subjects</Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create/Assign Subject</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-4">
            <div className="flex items-center gap-4 mb-6">
              <Label htmlFor="mode">Mode:</Label>
              <div className="flex items-center gap-2">
                <Switch
                  id="mode"
                  checked={mode === "assign"}
                  onCheckedChange={(checked) => {
                    setMode(checked ? "assign" : "create");
                    form.resetField(checked ? "subjectId" : "subjectName");
                  }}
                />
                <Label>{mode === "create" ? "Create New" : "Assign Existing"}</Label>
              </div>
            </div>

            {mode === "create" ? (
              <>
                <FormField
                  control={form.control}
                  name="subjectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter subject name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
<FormField
  control={form.control}
  name="book"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Course Material (Optional)</FormLabel>
      <FormControl>
        <BookUploader 
          onUploadSuccess={(url) => field.onChange(url)}
          initialFile={field.value}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Subject</FormLabel>
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
            )}

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

            <Button
              type="submit"
              disabled={createSubject.isPending || assignSubject.isPending}
              className="w-full mt-6"
            >
              {(createSubject.isPending || assignSubject.isPending) ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "create" ? "Creating..." : "Assigning..."}
                </>
              ) : (
                mode === "create" ? "Create & Assign" : "Assign Subject"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};