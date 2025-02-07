"use client";
import { useTodoStore } from "@/public/store/TodoSlice";
import { Loader2Icon } from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";

const AISummary = () => {
  const { aiTodoPrompt, loading } = useTodoStore((state) => state);
  return (
    <div className="flex flex-col p-3 md:p-5 border-2 border-pink-400 rounded-md max-w-4xl text-center mt-6 md:mt-0 md:mb-5 mx-auto shadow-md items-center gap-2 transition-all min-h-12 h-auto w-auto">
      <h3 className="font-bold md:text-lg">
        Our AI will summarize your task for the day...
      </h3>
      {loading ? (
        <Loader2Icon size={20} className="animate-spin" />
      ) : (
        <ReactMarkdown className="font-medium text-sm md:text-base italic">
          {aiTodoPrompt}
        </ReactMarkdown>
      )}
    </div>
  );
};

export default AISummary;
