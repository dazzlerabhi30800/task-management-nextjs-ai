import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTodoStore } from "@/public/store/TodoSlice";

type category = {
  width?: number | string;
  type?: string;
};

export function SelectCategory({ width, type }: category) {
  const { todoInfo, setTodoInfo, filterTodos } = useTodoStore((state) => state);
  const handleStatus = (status: string) => {
    if (!type) {
      setTodoInfo({ ...todoInfo, status: status });
      return;
    } else {
      filterTodos(status);
    }
  };

  return (
    <Select
      value={todoInfo.status}
      onValueChange={(value) => handleStatus(value)}
    >
      <SelectTrigger style={{ width: width ? width : 100 }}>
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>
          <SelectItem value="to-do">To-do</SelectItem>
          <SelectItem value="in-progress">In-Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          {type && <SelectItem value="all">All</SelectItem>}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
