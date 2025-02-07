import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { todo, useTodoStore } from "@/public/store/TodoSlice";
import { useUserStore } from "@/public/store/UserSlice";
import { PlusIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface props {
  data: Array<string>;
  children?: React.ReactNode;
  additionalStyles?: string;
  defaultValue?: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  todo?: todo;
  type?: string;
}

export default function TableTaskStatus({
  data,
  children,
  additionalStyles,
  defaultValue,
  setValue,
  todo,
  type,
}: props) {
  const [statusValue, setStatus] = useState<string>(
    defaultValue ?? data[0].toUpperCase(),
  );
  const { updateTodo, setHistory } = useTodoStore((state) => state);
  const { user } = useUserStore((state) => state);

  //NOTE: loading for the task

  const [open, setOpen] = useState<boolean>(false);
  const handleChange = async (status: string) => {
    if (setValue) {
      if (defaultValue !== status && todo && type) {
        setHistory({
          actionType: `${type} updated from ${defaultValue} to ${status}`,
          time: Date.now(),
        });
        updateTodo(todo, type, status, user?.id as string);
        toast(`${type} updated from ${defaultValue} to ${status}`);
      }
    } else {
      setStatus(status.toUpperCase());
    }
    console.log(statusValue);
    setOpen(false);
  };
  const ref = useRef<HTMLDivElement>(null);

  function handleOutside(e: MouseEvent) {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }

  useEffect(() => {
    window.addEventListener("click", handleOutside);
    return () => window.removeEventListener("click", handleOutside);
  });

  return (
    <div className="w-fit h-fit" ref={ref}>
      <Popover open={open}>
        <PopoverTrigger asChild className="w-inherit h-inherit">
          <Button
            variant="outline"
            onClick={() => setOpen((prev) => !prev)}
            className={`text-gray-400 rounded-[50%] w-fit h-fit p-2 hover:border-black ${additionalStyles}`}
          >
            {children ? children : <PlusIcon size={15} />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-0">
          <div className="flex flex-col">
            {data?.map((status, index) => (
              <h3
                key={index}
                className="py-2 px-4 hover:bg-gray-200 cursor-pointer"
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
}
