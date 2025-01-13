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
  studentClassId: string
  feeId: string
  onAllotmentSuccess: () => void
}

export function FeeAllotmentDialog({ studentClassId, feeId, onAllotmentSuccess }: FeeAllotmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [discount, setDiscount] = useState("")
  const [discountbypercent, setDiscountbypercent] = useState("")
  const [discountDescription, setDiscountDescription] = useState("")

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

  const handleSubmit = () => {
    assignFeeToStudent.mutate({
      studentClassId,
      feeId,
      discount: parseFloat(discount),
      discountbypercent: parseFloat(discountbypercent),
      discountDescription,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Allot Fee to students</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Fee to Student</DialogTitle>
          <DialogDescription>
            Assign a fee to a student with optional discounts.
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
            Assign Fee
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

