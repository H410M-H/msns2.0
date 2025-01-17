"use client";

import { useState } from "react";
import { Calendar } from "~/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "~/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { format } from "date-fns";
import { type DayProps } from "react-day-picker";

interface SessionEvent {
  id: string;
  title: string;
  date: Date;
  time?: string;
  type: "exam" | "holiday" | "event";
}

interface SessionCalendarProps {
  sessionStart: Date;
  sessionEnd: Date;
  events?: SessionEvent[];
  onAddEvent?: (date: Date) => void;
  onMonthChange?: (month: Date) => void;
}

export function SessionCalendar({
  sessionStart,
  sessionEnd,
  events = [],
  onAddEvent = (date) => alert(`Add event on ${format(date, "yyyy-MM-dd")}`),
  onMonthChange,
}: SessionCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(sessionStart));
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleMonthChange = (offset: number) => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(
        prevMonth.getFullYear(),
        prevMonth.getMonth() + offset
      );
      if (offset < 0 && newMonth >= sessionStart) {
        onMonthChange?.(newMonth);
        return newMonth;
      }
      if (offset > 0 && newMonth <= sessionEnd) {
        onMonthChange?.(newMonth);
        return newMonth;
      }
      return prevMonth;
    });
  };

  const getDayEvents = (date: Date) => {
    return events.filter(
      (event) => format(event.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  return (
    <Card className="flex flex-col w-full shadow-lg">
      <CardHeader className="flex items-center justify-between pb-4">
        <CardTitle className="text-lg font-bold">Session Calendar</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleMonthChange(-1)}
            disabled={currentMonth <= sessionStart}
            aria-label="Previous Month"
            title="Previous Month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-semibold text-gray-700">
            {format(currentMonth, "MMMM yyyy")}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleMonthChange(1)}
            disabled={
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1) >
              sessionEnd
            }
            aria-label="Next Month"
            title="Next Month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => selectedDate && onAddEvent(selectedDate)}
            aria-label="Add Event"
            title="Add Event"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => setSelectedDate(date ?? undefined)}
          month={currentMonth}
          className="rounded-md border"
          disabled={(date) => date < sessionStart || date > sessionEnd}
          components={{
            Day: (props: DayProps & { className?: string }) => {
              const { date } = props;
              const dayEvents = getDayEvents(date);
              return (
                <Popover key={date.toString()}>
                  <PopoverTrigger asChild>
                    <button
                      {...props}
                      className={cn(
                        props.className,
                        "relative h-10 w-10 p-1 text-center font-normal aria-selected:opacity-100",
                        dayEvents.length > 0
                          ? "bg-gray-100 hover:bg-gray-200 focus:bg-gray-300"
                          : "hover:bg-gray-50"
                      )}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <time
                          dateTime={format(date, "yyyy-MM-dd")}
                          className={cn(
                            dayEvents.length > 0 && "font-bold text-blue-600"
                          )}
                        >
                          {format(date, "d")}
                        </time>
                      </div>
                    </button>
                  </PopoverTrigger>
                  {dayEvents.length > 0 && (
                    <PopoverContent className="w-64 p-3 shadow-md">
                      <div className="space-y-2">
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              "rounded-md p-2 text-sm",
                              event.type === "exam" && "bg-yellow-100",
                              event.type === "holiday" && "bg-red-100",
                              event.type === "event" && "bg-blue-100"
                            )}
                          >
                            <div className="font-medium">{event.title}</div>
                            {event.time && (
                              <div className="text-xs text-gray-500">
                                {event.time}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  )}
                </Popover>
              );
            },
          }}
        />
        {selectedDate && (
          <div className="mt-4 text-center text-sm">
            Selected Date: <strong>{format(selectedDate, "MMMM d, yyyy")}</strong>
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedDate(undefined)}
          className="mt-2"
        >
          Clear Selection
        </Button>
      </CardContent>
    </Card>
  );
}
