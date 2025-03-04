"use client";
import Hero from "@/components/custom/Hero";
import { useTodoStore } from "@/public/store/TodoSlice";
import { useUserStore } from "@/public/store/UserSlice";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user } = useUserStore((state) => state);
  const { setTodos, setTodoInfoInitial } = useTodoStore((state) => state);

  useEffect(() => {
    if (user) return;
    setTodos([]);
    setTodoInfoInitial();
  }, []);

  // TODO: we have to fix this code next morning.
  if (user) return redirect("/list");
  return (
    <div>
      <Hero />
    </div>
  );
}
