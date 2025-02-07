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
  React.useEffect(() => {
    if (!type) {
      setTodoInfo({ ...todoInfo, status: category });
      return;
    } else if (category === "") {
      return;
    } else {
      filterTodos(category);
    }
  }, [category]);
  return (
    <Select
      defaultValue={category}
      onValueChange={(value) => setCategory(value)}
    >
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
