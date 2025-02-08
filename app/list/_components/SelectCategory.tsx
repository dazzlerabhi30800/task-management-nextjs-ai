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
  const [category, setCategory] = React.useState<string>(todoInfo.status);
  const handleStatus = (status: string) => {
    if (!type) {
      setTodoInfo({ ...todoInfo, status: status });
      return;
    } else {
      filterTodos(status);
    }
  };

  React.useEffect(() => {
    if (todoInfo.status === "") return;
    setCategory(todoInfo.status);
  }, [todoInfo.status]);
  return (
    <Select value={category} onValueChange={(value) => handleStatus(value)}>
      <SelectTrigger style={{ width: width ? width : 100 }}>
        <SelectValue placeholder="Category" />
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
