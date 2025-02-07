"use client";
import Hero from "@/components/custom/Hero";
import { useUserStore } from "@/public/store/UserSlice";
import { redirect } from "next/navigation";

export default function Home() {
  const { user } = useUserStore((state) => state);

  if (user) return redirect("/list");
  return (
    <div>
      <Hero />
    </div>
  );
}
