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
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { api } from "~/trpc/react"
import { useToast } from "~/hooks/use-toast"

type FeeAllotmentDialogProps = {
  sfcId?: string
  studentClassId: string
  feeId: string
  initialDiscount?: number
  initialDiscountPercent?: number
  initialDiscountDescription?: string
  onAllotmentSuccess: () => void
}

export function FeeAllotmentDialog({
  sfcId,
  studentClassId,
  feeId,
  initialDiscount = 0,
  initialDiscountPercent = 0,
  initialDiscountDescription = "",
  onAllotmentSuccess
}: FeeAllotmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [discount, setDiscount] = useState(initialDiscount.toString())
  const [discountbypercent, setDiscountbypercent] = useState(initialDiscountPercent.toString())
  const [discountDescription, setDiscountDescription] = useState(initialDiscountDescription)

  const { toast } = useToast()

  const assignFeeToStudent = api.fee.assignFeeToStudent.useMutation({
    onSuccess: () => {
      toast({
        title: "Fee assigned successfully",
        description: "The fee has been assigned to the student.",
      })
      setOpen(false)
      onAllotmentSuccess()
    },
    onError: (error) => {
      toast({
        title: "Error assigning fee",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const updateFeeAssignment = api.fee.updateFeeAssignment.useMutation({
    onSuccess: () => {
      toast({
        title: "Fee assignment updated successfully",
        description: "The fee assignment has been updated.",
      })
      setOpen(false)
      onAllotmentSuccess()
    },
    onError: (error) => {
      toast({
        title: "Error updating fee assignment",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleSubmit = () => {
    const data = {
      discount: parseFloat(discount),
      discountbypercent: parseFloat(discountbypercent),
      discountDescription,
    }

    if (sfcId) {
      updateFeeAssignment.mutate({ sfcId, ...data })
    } else {
      assignFeeToStudent.mutate({
        studentClassId,
        feeId,
        ...data,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{sfcId ? "Edit Fee Assignment" : "Assign Fee"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{sfcId ? "Edit Fee Assignment" : "Assign Fee to Student"}</DialogTitle>
          <DialogDescription>
            {sfcId ? "Modify the fee assignment details." : "Assign a fee to a student with optional discounts."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="discount" className="text-right">
              Discount
            </Label>
            <Input
              id="discount"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="discountbypercent" className="text-right">
              Discount %
            </Label>
            <Input
              id="discountbypercent"
              type="number"
              value={discountbypercent}
              onChange={(e) => setDiscountbypercent(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="discountDescription" className="text-right">
              Description
            </Label>
            <Input
              id="discountDescription"
              value={discountDescription}
              onChange={(e) => setDiscountDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            {sfcId ? "Update Assignment" : "Assign Fee"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

