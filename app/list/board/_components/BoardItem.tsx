import { todoItem } from "@/public/store/TodoSlice";
import React from "react";
import BoardComp from "./BoardComp";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import useResize from "@/lib/useResize";

const BoardItem = ({ todo, index }: { todo: todoItem; index: number }) => {
  const { resize } = useResize();
  return (
    <Draggable
      isDragDisabled={resize <= 768}
      index={index}
      draggableId={todo.id}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          className="h-full"
        >
          <Droppable droppableId={todo.id.toString()} type="card">
            {(provided, snapshot) => (
              <div
                className="h-full"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div
                  className={`${
                    snapshot.isDraggingOver ? `${todo.id}` : "bg-gray-200"
                  } p-4 rounded-lg shadow-md w-full flex flex-col gap-3 overflow-y-auto h-full kanban-board`}
                >
                  <h3
                    className={`${todo.id} py-1 px-2 rounded-lg w-fit font-semibold text-sm uppercase text-gray-700`}
                  >
                    {todo.id}
                  </h3>
                  {todo.todos.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {todo.todos.map((item, index) => (
                        <BoardComp key={index} item={item} index={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-3 text-lg text-center font-bold text-gray-400">
                      No Todos
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default BoardItem;
