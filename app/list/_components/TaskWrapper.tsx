import React, { useState } from "react";
import TodoComp from "./TodoComp";
import { Draggable } from "@hello-pangea/dnd";
import useResize from "@/lib/useResize";
import { todo } from "@/public/store/TodoSlice";

const TaskWrapper = ({ todos }: { todos: Array<todo> }) => {
  const { resize } = useResize();
  const [page, setPage] = useState(1);
  const threshold = 5;
  const limit =
    Math.floor(todos.length / threshold) +
    (todos.length % threshold > 0 ? 1 : 0);
  return (
    <div className="py-3">
      {todos?.slice(0, threshold * page).map((todo, index) => (
        <Draggable
          isDragDisabled={resize < 768}
          key={todo.id}
          draggableId={todo.id as string}
          index={index}
        >
          {(provided, snapshot) => (
            <TodoComp
              todo={todo}
              id={todo?.id as string}
              index={index}
              draggableProps={provided.draggableProps}
              dragHandleProps={provided.dragHandleProps}
              innerRef={provided.innerRef}
              snapshot={snapshot}
            />
          )}
        </Draggable>
      ))}
      {todos.length > threshold && page < limit && (
        <button
          onClick={() =>
            setPage((prev) => (prev + 1 > limit ? prev : prev + 1))
          }
          className="w-full pt-4 pb-2 px-4 italic hover:underline font-semibold my-2 hover:text-blue-500"
        >
          Show {todos.length - page * threshold} More
        </button>
      )}
      {page > 1 && (
        <button
          onClick={() => setPage((prev) => (prev - 1 <= 1 ? 1 : prev - 1))}
          className="w-full pt-4 pb-2 px-4 italic hover:underline font-semibold my-2 hover:text-blue-500"
        >
          Hide Todos
        </button>
      )}
    </div>
  );
};

export default TaskWrapper;
