import { useState } from 'react'
import { Calendar } from "~/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "~/components/ui/button"


export function SessionCalendar({ isOpen, onClose, sessionStart, sessionEnd }: { isOpen: boolean, onClose: () => void, sessionStart: Date, sessionEnd: Date }) {
  const [currentMonth, setCurrentMonth] = useState(new Date(sessionStart));

  const handleMonthChange = (offset: number) => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + offset);
      if (offset < 0 && newMonth >= sessionStart) return newMonth;
      if (offset > 0 && newMonth <= sessionEnd) return newMonth;
      return prevMonth;
    });
  };

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
              onClick={() => handleMonthChange(-1)}
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
              onClick={() => handleMonthChange(1)}
              disabled={new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1) > sessionEnd}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Calendar
            mode="multiple"
            className="rounded-md border"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

