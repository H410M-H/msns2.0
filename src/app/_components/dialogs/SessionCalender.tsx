import { useState } from 'react'
import { Calendar } from "~/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "~/components/ui/button"

type SessionCalendarProps = {
  isOpen: boolean
  onClose: () => void
  sessionStart: Date
  sessionEnd: Date
}

export function SessionCalendar({ isOpen, onClose, sessionStart, sessionEnd }: SessionCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(sessionStart))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Session Calendar</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(prevMonth => {
                const newMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1);
                return newMonth >= sessionStart ? newMonth : prevMonth;
              })}
              disabled={currentMonth <= sessionStart}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(prevMonth => {
                const newMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1);
                return newMonth <= sessionEnd ? newMonth : prevMonth;
              })}
              disabled={new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1) > sessionEnd}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Calendar
            mode="multiple"
            selected={[]}
            month={currentMonth}
            numberOfMonths={1}
            fixedWeeks
            className="rounded-md border"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

