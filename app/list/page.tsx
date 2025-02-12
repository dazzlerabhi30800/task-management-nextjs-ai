"use client";
import React, { useEffect } from "react";
import TaskTableWrapper from "./_components/TaskTableWrapper";
import TaskCreateDialog from "@/components/custom/AddTaskDialog/TaskCreateDialog";
import AISummary from "@/components/custom/AISummary";
import { useUserStore } from "@/public/store/UserSlice";
import { useTodoStore } from "@/public/store/TodoSlice";

export default function List() {
  const { user } = useUserStore((state) => state);
  const { fetchTodos } = useTodoStore((state) => state);
  useEffect(() => {
    if (!user) return;
    fetchTodos(user?.id as string);
  }, []);
  return (
    <div className="px-4 sm:px-6 md:px-8 flex flex-col flex-1 relative">
      <AISummary />
      <TaskTableWrapper />
      <TaskCreateDialog />
    </div>
  );
}
