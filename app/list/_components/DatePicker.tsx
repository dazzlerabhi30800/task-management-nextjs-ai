import React, { useEffect, useRef } from "react";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const DatePicker = () => {
  const [date, setDate] = React.useState<Date | undefined>();
  const [showCal, setShowCal] = React.useState<boolean>(false);
  useEffect(() => {
    setShowCal(false);
  }, [date]);

  const ref = useRef<HTMLDivElement>(null);
  
  
  // NOTE: function to close the calendar if clicked outside the wrapper
  const handleOutside = (e: MouseEvent) => {
    if (ref?.current && !ref?.current.contains(e.target as Node)) {
      setShowCal(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleOutside);
    return () => window.removeEventListener("click", handleOutside);
  }, []);

  return (
    <div ref={ref} className="flex flex-col gap-1 relative w-fit">
      <Button
        variant="outline"
        className="rounded-3xl w-fit text-gray-400 hover:text-black"
        onClick={() => setShowCal(!showCal)}
      >
        <CalendarIcon /> {date ? date.toString().substring(0, 25) : "Due Date"}
      </Button>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className={`rounded-md border ${
          showCal ? "block" : "hidden"
        } absolute -bottom-[300px] bg-white`}
      />
    </div>
  );
};

export default DatePicker;
