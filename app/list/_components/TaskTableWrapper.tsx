"use client";
import React from "react";
import TaskTableHeader from "./TaskTableHeader";
import TaskTableComp from "./TaskTableComp";
import { useTodoStore } from "@/public/store/TodoSlice";
import Spinner from "./Spinner";
import ResultsNotFound from "@/components/custom/ResultsNotFound";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import DragDropFunc from "./DragDropFunc";

const TaskTableWrapper = () => {
  const todoState = useTodoStore((state) => state);
  const { todos, loading, todoSearchString } = todoState;
  const { handleDropResult } = DragDropFunc();

  // NOTE: to check if the todos length in every object is less than 1 then show the result not found component
  const checkTodosLength =
    loading || todoSearchString.length === 0 || !todoState
      ? false
      : todos.every((item) => item.todos.length === 0);
  console.log(todos);

  return (
    <div className="flex flex-col flex-1 py-3 pb-10 mt-7 md:mt-3 border-t border-gray-300">
      <TaskTableHeader />
      <DragDropContext onDragEnd={handleDropResult}>
        {!loading ? (
          checkTodosLength ? (
            <ResultsNotFound />
          ) : (
            <Droppable droppableId="todoboard" direction="vertical" type="row">
              {(provided) => (
                <div
                  className="flex flex-col gap-9 mt-8"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {todos?.map((item, index) => (
                    <TaskTableComp
                      key={index}
                      id={item.id}
                      todos={item.todos}
                      index={index}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )
        ) : (
          <Spinner additionalStyles="mt-10" />
        )}
      </DragDropContext>
    </div>
  );
};

export default TaskTableWrapper;
