import React from "react";
import Header from "./_components/Header";
import MultipleActionPicker from "@/components/custom/MultipleActionPicker";

export default function ListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MultipleActionPicker />
      {children}
    </div>
  );
}
