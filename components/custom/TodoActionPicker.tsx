import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useActionStore } from "@/public/store/ActionSlice";
import { todo, useTodoStore } from "@/public/store/TodoSlice";
import { useUserStore } from "@/public/store/UserSlice";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export default function TodoActionPicker({
  todo,
  additionalStyles,
}: {
  todo: todo;
  additionalStyles?: string;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const { setTodoInfo, deleteTask } = useTodoStore((state) => state);
  const { setShowTaskDialog } = useActionStore((state) => state);
  const { user } = useUserStore((state) => state);
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

  const handleEditTodo = () => {
    // const newTodo = Object.assign({}, todo);
    setTodoInfo(todo);
    setShowTaskDialog();
  };

  return (
    <div
      ref={ref}
      className={`block absolute top-1/2 -translate-y-1/2 text-cusBlack right-4 hover:text-gray-400 ${additionalStyles}`}
    >
      <Popover open={open}>
        <PopoverTrigger asChild className="w-inherit h-inherit">
          <Button
            variant="ghost"
            onClick={() => setOpen((prev) => !prev)}
            className={`text-gray-400 w-fit px-2 hover:border-black`}
          >
            <Ellipsis size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-24 mr-4 md:mr-0 p-0">
          <div className="flex flex-col w-full">
            <Button
              onClick={handleEditTodo}
              variant="ghost"
              className="w-full justify-start text-black"
            >
              <Pencil />
              Edit
            </Button>
            <Button
              onClick={() => {
                deleteTask(todo, user?.id as string);
                setOpen(false);
              }}
              variant="ghost"
              className="w-full justify-start text-red-500"
            >
              <Trash2 />
              Delete
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
