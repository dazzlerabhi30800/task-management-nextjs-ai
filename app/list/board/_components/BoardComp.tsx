import TodoActionPicker from "@/components/custom/TodoActionPicker";
import useResize from "@/lib/useResize";
import { checkDueTime, formatDate } from "@/lib/utils";
import { todo } from "@/public/store/TodoSlice";
import { Draggable } from "@hello-pangea/dnd";
import React from "react";

interface boardCompProps {
  item: todo;
  index: number;
}

const BoardComp = ({ item, index }: boardCompProps) => {
  const { resize } = useResize();
  return (
    <Draggable
      isDragDisabled={resize <= 768}
      key={index}
      index={index}
      draggableId={item.id as string}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          className="bg-white py-4 px-2 rounded-lg flex flex-col justify-between gap-4 h-28 w-full relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-cusBlack gap-5">
            <p>{item.text}</p>
          </div>
          <div className="flex items-center w-full justify-between text-gray-500">
            <small>{item.category}</small>
            <small
              className={`${
                checkDueTime(item?.dueDate)
                  ? "text-gray-500"
                  : "text-red-400 font-bold underline"
              }  `}
            >
              {formatDate(item?.dueDate)}
            </small>
          </div>

          <TodoActionPicker
            todo={item}
            additionalStyles="top-4 right-0 translate-y-0"
          />
        </div>
      )}
    </Draggable>
  );
};

export default BoardComp;
