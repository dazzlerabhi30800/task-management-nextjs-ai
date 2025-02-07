import React, { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { statusData } from "@/data/statusData";
import { useTodoStore } from "@/public/store/TodoSlice";
import { useUserStore } from "@/public/store/UserSlice";

const StatusPicker = () => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const { performMultipleActions } = useTodoStore((state) => state);
  const { user } = useUserStore((state) => state);
  const ref = useRef<HTMLDivElement>(null);

  const handleChange = async (status: string) => {
    setStatus(status);
    performMultipleActions("status", user?.id as string, status);
    setOpen(false);
  };

  function handleOutside(e: MouseEvent) {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }

  React.useEffect(() => {
    window.addEventListener("click", handleOutside);
    return () => window.removeEventListener("click", handleOutside);
  });

  return (
    <div className="w-fit h-fit" ref={ref}>
      <Popover open={open}>
        <PopoverTrigger asChild className="w-inherit h-inherit ">
          <Button
            variant="outline"
            onClick={() => setOpen((prev) => !prev)}
            className="bg-white/20 border border-cusGray rounded-3xl"
          >
            {status === "" ? "Status" : status}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-0 bg-[#1a1a1a] text-white border-red-500 shadow-md">
          <div className="flex flex-col">
            {statusData?.map((status, index) => (
              <h3
                key={index}
                className="py-2 px-4 hover:bg-gray-600 cursor-pointer"
                onClick={() => handleChange(status)}
              >
                {status.toUpperCase()}
              </h3>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default StatusPicker;
