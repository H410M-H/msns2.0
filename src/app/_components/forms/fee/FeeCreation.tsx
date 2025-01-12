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
import { api } from "~/trpc/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useToast } from "~/hooks/use-toast";

export function FeeCreationDialog() {
  const [open, setOpen] = useState(false);
  const [feeName, setFeeName] = useState("");
  const [tuition, setTuition] = useState("");
  const [type, setType] = useState<"MonthlyFee" | "AnnualFee">("MonthlyFee");

  const { toast } = useToast();

  const createFee = api.fee.createFee.useMutation({
    onSuccess: () => {
      toast({
        title: "Fee created successfully",
        description: "The new fee has been added to the system.",
      });
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error creating fee",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    createFee.mutate({
      feeName,
      tuition: parseFloat(tuition),
      type,
    });
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
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="feeName" className="text-right">
              Fee Name
            </Label>
            <Input
              id="feeName"
              value={feeName}
              onChange={(e) => setFeeName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tuition" className="text-right">
              Tuition
            </Label>
            <Input
              id="tuition"
              type="number"
              value={tuition}
              onChange={(e) => setTuition(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select
              onValueChange={(value) =>
                setType(value as "MonthlyFee" | "AnnualFee")
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select fee type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MonthlyFee">Monthly Fee</SelectItem>
                <SelectItem value="AnnualFee">Annual Fee</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Create Fee
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
