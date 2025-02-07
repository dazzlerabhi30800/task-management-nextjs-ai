"use client";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import React, { useState } from "react";
import AddTaskButton from "./AddTaskButton";
import TaskWrapper from "./TaskWrapper";
import { todo } from "@/public/store/TodoSlice";
import { firstCharCapital } from "@/lib/utils";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import useResize from "@/lib/useResize";

function TaskTableComp({
  id,
  todos,
  index,
}: {
  id: string;
  todos: Array<todo>;
  index: number;
}) {
  const [collapse, setCollapse] = useState(false);
  const { resize } = useResize();
  return (
    <div
      className={`flex flex-col rounded-xl shadow-md bg-gray-100 ${
        collapse ? "h-8 overflow-hidden" : "h-auto"
      } transition-all`}
    >
      {/* NOTE: Task Header */}
      <div
        className={`flex items-center justify-between rounded-t-xl p-1 px-4 font-bold ${id}`}
      >
        <h4>
          {id === "to-do" ? "Todo" : firstCharCapital(id)} ({todos.length})
        </h4>
        <button
          onClick={() => setCollapse((prev) => !prev)}
          className="hover:text-white"
        >
          {collapse ? (
            <ChevronDownIcon className="w-6 h-6" />
          ) : (
            <ChevronUpIcon className="w-6 h-6" />
          )}
        </button>
      </div>
      {id === "to-do" && <AddTaskButton />}
      <Draggable isDragDisabled={resize < 768} draggableId={id} index={index}>
        {(provided) => (
          <div
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <Droppable droppableId={id.toString()} type="card">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <TaskWrapper todos={todos} />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        )}
      </Draggable>
    </div>
  );
}

export default TaskTableComp;
