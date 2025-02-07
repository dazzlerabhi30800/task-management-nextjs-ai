import { useTodoStore } from "@/public/store/TodoSlice";
import React from "react";
import BoardItem from "./BoardItem";
import ResultsNotFound from "@/components/custom/ResultsNotFound";
import Spinner from "../../_components/Spinner";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import DragDropFunc from "../../_components/DragDropFunc";

const KanbanBoard = () => {
  const todoState = useTodoStore((state) => state);
  const { todos, loading, todoSearchString } = todoState;
  const checkTodosLength =
    loading || todoSearchString.length === 0 || !todoState
      ? false
      : todos.every((item) => item.todos.length === 0);

  const { handleDropResult } = DragDropFunc();

  return (
    <div className="mt-10 w-full flex flex-1 h-full">
      <DragDropContext onDragEnd={handleDropResult}>
        {!loading ? (
          checkTodosLength ? (
            <ResultsNotFound />
          ) : (
            <Droppable
              droppableId="KanbanBoardTodos"
              type="column"
              direction="horizontal"
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-full h-inherit"
                >
                  <div className="grid h-full md:grid-cols-3 pt-5 pb-10 w-full gap-8 md:gap-5 lg:gap-8">
                    {todos?.map((todo, index) => (
                      <BoardItem index={index} key={index} todo={todo} />
                    ))}
                  </div>
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

export default KanbanBoard;
