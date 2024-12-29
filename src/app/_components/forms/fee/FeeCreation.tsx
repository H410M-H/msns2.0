"use client";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

const formSchema = z.object({
  feeName: z.string({ required_error: "Field is required" }),
  tuition: z.number().min(0, "Tuition must be a positive number"),
  type: z.enum(["MonthlyFee", "AnnualFee"], {
    required_error: "Fee type is required",
  }),
  fee: z.number().min(0, "Fee must be a positive number"),
});

export const FeeCreationDialog = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tuition: 0,
      fee: 0,
    },
  });

  const createFee = api.fee.createFee.useMutation({
    onSuccess: () => {
      form.reset();
    },
  });

  const formSubmitted = (values: z.infer<typeof formSchema>) => {
    createFee.mutate(values);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Add Fee
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Fee</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(formSubmitted)}
            className="flex flex-col gap-4 p-4"
          >
            <FormField
              control={form.control}
              name="feeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fee Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter fee name"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fee Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MonthlyFee">Monthly Fee</SelectItem>
                      <SelectItem value="AnnualFee">Annual Fee</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tuition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tuition Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter tuition amount"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Fee</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter additional fee amount"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={createFee.isPending}
              className="w-full"
            >
              {createFee.isPending ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Create Fee"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};