"use client";
import React from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import StatusPicker from "./AddTaskDialog/StatusPicker";
import { useTodoStore } from "@/public/store/TodoSlice";
import { useUserStore } from "@/public/store/UserSlice";

const MultipleActionPicker = () => {
  const { multipleActionData, setMultipleActionData, performMultipleActions } =
    useTodoStore((state) => state);
  const { user } = useUserStore((state) => state);
  const handleDeleteTodos = async () => {
    performMultipleActions("delete", user?.id as string);
  };
  return (
    <div
      className={`bg-darkGray z-40 p-3 rounded-md shadow-md flex justify-between items-center text-sm text-cusGray fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-max ${
        multipleActionData.length > 0 ? "scale-100" : "scale-0"
      } transition-all`}
    >
      <div className="flex items-center gap-2 rounded-3xl border border-cusGray p-2 px-4">
        {multipleActionData.length} files selected{" "}
        <button className="gap-4 rounded-3xl hover:text-red-500">
          <X size={15} onClick={() => setMultipleActionData([])} />
        </button>
      </div>
      <div className="flex items-center ml-3 gap-3">
        {/* NOTE: Status Selector */}
        <StatusPicker />
        {/* NOTE: Delete Button */}
        <Button
          variant="ghost"
          onClick={handleDeleteTodos}
          className="border font-medium border-red-500 hover:text-black hover:bg-red-500  text-red-500 rounded-3xl"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default MultipleActionPicker;

