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
}

export function SessionCalendar({
  sessionStart,
  sessionEnd,
  events = [],
  onAddEvent,
}: SessionCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(sessionStart));
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const handleMonthChange = (offset: number) => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(
        prevMonth.getFullYear(),
        prevMonth.getMonth() + offset
      );
      if (offset < 0 && newMonth >= sessionStart) return newMonth;
      if (offset > 0 && newMonth <= sessionEnd) return newMonth;
      return prevMonth;
    });
  };

  const getDayEvents = (date: Date) => {
    return events.filter((event) =>
      format(event.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="flex items-center justify-between pb-4">
        <CardTitle>Calendar</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleMonthChange(-1)}
            disabled={currentMonth <= sessionStart}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-semibold">
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
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          {onAddEvent && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => selectedDate && onAddEvent(selectedDate)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
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
                        dayEvents.length > 0 && "bg-gray-100"
                      )}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <time dateTime={format(date, "yyyy-MM-dd")}>
                          {format(date, "d")}
                        </time>
                      </div>
                    </button>
                  </PopoverTrigger>
                  {dayEvents.length > 0 && (
                    <PopoverContent className="w-64 p-2">
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
                              <div className="text-xs text-gray-500">{event.time}</div>
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
      </CardContent>
    </Card>
  );
}