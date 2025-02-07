"use client";
import { Button } from "@/components/ui/button";
import { CornerDownLeft, PlusIcon } from "lucide-react";
import React from "react";
import TableTaskStatus from "./TableTaskStatus";
import { statusData, taskCategoryData } from "@/data/statusData";
import DatePicker from "./DatePicker";
import { useActionStore } from "@/public/store/ActionSlice";

const AddTaskButton = () => {
  const { showAddTaskBtn } = useActionStore(
    (state) => state
  );
  return (
    <div className="hidden md:block">
      <div className="py-2 border-b border-gray-200 px-8">
        <button
          className="flex items-center gap-1 font-semibold"
        >
          <PlusIcon size={13} /> Add Task
        </button>
      </div>
      {showAddTaskBtn && (
        <div className="py-3 grid grid-cols-10 px-8 border-b border-gray-200">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-2 col-span-3"
          >
            <input
              type="text"
              placeholder="Task"
              className="outline-none bg-transparent border-b border-b-transparent focus:border-b-gray-400 max-w-[250px]"
            />
            <div className="flex items-center gap-2 mt-2">
              <Button
                type="submit"
                className="bg-violet-500 rounded-3xl text-sm"
              >
                ADD <CornerDownLeft />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-3xl text-sm"
              >
                Cancel
              </Button>
            </div>
          </form>
          <div className="col-span-2">
            <DatePicker />
          </div>
          <div className="col-span-2">
            <TableTaskStatus data={statusData} />
          </div>

          <div className="col-span-3">
            <TableTaskStatus data={taskCategoryData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTaskButton;
