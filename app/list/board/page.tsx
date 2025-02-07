"use client";
import TaskCreateDialog from "@/components/custom/AddTaskDialog/TaskCreateDialog";
import { useActionStore } from "@/public/store/ActionSlice";
import React from "react";
import KanbanBoard from "./_components/KanbanBoard";
import { useUserStore } from "@/public/store/UserSlice";
import { useTodoStore } from "@/public/store/TodoSlice";

const Board = () => {
  const { showTaskDialog } = useActionStore((state) => state);
  const { user } = useUserStore((state) => state);
  const { fetchTodos } = useTodoStore((state) => state);

  React.useEffect(() => {
    if (!user) return;
    fetchTodos(user?.id as string);
  }, [user]);
  return (
    <div className="px-4 sm:px-6 md:px-8 flex flex-col flex-1 relative">
      <KanbanBoard />
      {showTaskDialog && <TaskCreateDialog />}
    </div>
  );
};

export default Board;
