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

export function SelectDueDate() {
  const [dateType, setDateType] = React.useState<string>("");
  const { sortTodos } = useTodoStore((state) => state);
  React.useEffect(() => {
    if (dateType === "") return;
    sortTodos(dateType);
  }, [dateType]);
  return (
    <Select onValueChange={(value) => setDateType(value)}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Due Date" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Order by date</SelectLabel>
          <SelectItem value="asc">Ascending</SelectItem>
          <SelectItem value="desc">Descending</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
