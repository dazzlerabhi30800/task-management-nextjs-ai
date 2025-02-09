"use client";
import React, { Suspense, useEffect } from "react";
import TaskTableWrapper from "./_components/TaskTableWrapper";
import TaskCreateDialog from "@/components/custom/AddTaskDialog/TaskCreateDialog";
import { useTodoStore } from "@/public/store/TodoSlice";
import { useUserStore } from "@/public/store/UserSlice";
import AISummary from "@/components/custom/AISummary";

export default function List() {
  const { user } = useUserStore((state) => state);
  const { fetchTodos } = useTodoStore((state) => state);

  useEffect(() => {
    return () => {
      if (!user) return;
      fetchTodos(user?.id as string);
    };
  }, [user]);

  return (
    <div className="px-4 sm:px-6 md:px-8 flex flex-col flex-1 relative">
      <Suspense fallback={<div>Loading...</div>}>
        <AISummary />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <TaskTableWrapper />
      </Suspense>
      <TaskCreateDialog />
    </div>
  );
}
