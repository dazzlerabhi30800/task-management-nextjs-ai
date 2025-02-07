import { CircleCheck, GripVerticalIcon } from "lucide-react";
import React, { useState } from "react";
import TableTaskStatus from "./TableTaskStatus";
import { statusData, taskCategoryData } from "@/data/statusData";
import TodoActionPicker from "@/components/custom/TodoActionPicker";
import { todo, useTodoStore } from "@/public/store/TodoSlice";
import { formatDate } from "@/lib/utils";
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";

interface todoProps {
  todo: todo;
  id: string;
  index: number;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
  snapshot: DraggableStateSnapshot;
}

const TodoComp = ({
  todo,
  innerRef,
  draggableProps,
  dragHandleProps,
  snapshot,
}: todoProps) => {
  const [status, setStatus] = useState(todo.status);
  const [category, setCategory] = useState(todo.category);
  const { setMultipleActionData, multipleActionData } = useTodoStore(
    (state) => state,
  );

  const handleSelectTodo = (check: boolean) => {
    if (check) {
      setMultipleActionData([...multipleActionData, todo]);
    } else {
      setMultipleActionData(
        multipleActionData.filter((item) => item.id !== todo.id),
      );
    }
  };

  const findItem = multipleActionData.find((item) => item.id === todo.id);

  return (
    <div
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
      className={`grid grid-cols-1 md:grid-cols-10 py-2 text-cusBlack/70 px-4 border-b border-b-gray-300/50 flex justify-between items-center relative ${
        snapshot.isDragging && "scale-110 bg-gray-200"
      }  transition-all`}
    >
      <div className="flex items-center gap-2 col-span-3">
        <input
          onChange={(e) => handleSelectTodo(e.target.checked)}
          type="checkbox"
          checked={findItem ? true : false}
          className="w-[13px] h-[13px]"
        />
        <GripVerticalIcon size={15} />
        <CircleCheck
          size={15}
          className={`${todo.status === "completed" && "text-green-400"}`}
        />
        <h4 className="text-cusBlack/80 text-sm font-medium">{todo.text}</h4>
      </div>
      <p className="hidden md:block col-span-2">
        {todo.dueDate ? formatDate(todo.dueDate) : "Due Date"}
      </p>
      <div className="hidden md:block col-span-2">
        <TableTaskStatus
          data={statusData}
          additionalStyles="bg-[#dadada] py-1 px-2 text-black font-medium rounded-sm"
          defaultValue={todo.status}
          setValue={setStatus}
          todo={todo}
          type="status"
        >
          {status.toUpperCase()}
        </TableTaskStatus>
      </div>
      <div className="hidden md:block col-span-3">
        <TableTaskStatus
          data={taskCategoryData}
          additionalStyles="bg-[#dadada] py-1 px-2 text-black font-medium rounded-sm"
          defaultValue={todo.category}
          setValue={setCategory}
          todo={todo}
          type="category"
        >
          {category.toUpperCase()}
        </TableTaskStatus>
      </div>
      <TodoActionPicker todo={todo} />
    </div>
  );
};

export default TodoComp;
