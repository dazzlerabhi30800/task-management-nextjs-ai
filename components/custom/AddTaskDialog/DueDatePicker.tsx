import React, { useEffect, useRef } from "react";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTodoStore } from "@/public/store/TodoSlice";

type dueDate = {
  dateValue: Date | undefined | string;
};

const DueDatePicker = ({ dateValue }: dueDate) => {
  const [showCal, setShowCal] = React.useState<boolean>(false);
  const [error, setError] = React.useState(false);
  const { todoInfo, setTodoInfo } = useTodoStore((state) => state);

  const ref = useRef<HTMLDivElement>(null);

  // NOTE: function to close the calendar if clicked outside the wrapper
  const handleOutside = (e: MouseEvent) => {
    if (ref?.current && !ref?.current.contains(e.target as Node)) {
      setShowCal(false);
    }
  };

  // NOTE: function to check if date's chosen is less than today
  const handleDate = (date: Date | undefined | string) => {
    if (!date) return;
    const nowDate = new Date(Date.now());
    const passedDate = new Date(date);
    if (
      (nowDate.getDate() >= passedDate.getDate() &&
        nowDate.getMonth() === passedDate.getMonth()) ||
      nowDate.getFullYear() > passedDate.getFullYear()
    ) {
      setError(true);
    } else {
      setTodoInfo({ ...todoInfo, dueDate: date.toString() });
      setError(false);
    }
    setShowCal(false);
  };

  useEffect(() => {
    window.addEventListener("click", handleOutside);
    return () => window.removeEventListener("click", handleOutside);
  }, []);

  return (
    <div ref={ref} className="flex flex-col gap-1 relative w-full">
      <Button
        variant="outline"
        className="rounded-xl active:border-gray-400 w-full text-gray-500 hover:text-black bg-cusGray/50 justify-between items-center"
        onClick={() => setShowCal(!showCal)}
      >
        {dateValue ? dateValue.toString().substring(0, 15) : "DD/MM/YYYY"}{" "}
        <CalendarIcon />
      </Button>
      <Calendar
        mode="single"
        selected={
          dateValue instanceof Date
            ? dateValue
            : dateValue
            ? new Date(dateValue)
            : new Date(Date.now())
        }
        onSelect={(date) => handleDate(date)}
        className={`rounded-md border ${
          showCal ? "block" : "hidden"
        } absolute -bottom-[280px] bg-white`}
      />
      <small className={`${error ? "visible" : "invisible"} text-red-500`}>
        Due Date is Should be Greater than today
      </small>
    </div>
  );
};

export default DueDatePicker;
