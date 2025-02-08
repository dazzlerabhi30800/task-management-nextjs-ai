import { Button } from "@/components/ui/button";
import { checkNullObject } from "@/lib/utils";
import { useTodoStore } from "@/public/store/TodoSlice";
import { Loader2Icon } from "lucide-react";
import React from "react";

type props = {
  closeDialog: () => void;
  updateTodoTask: () => Promise<void>;
  createTask: () => Promise<void>;
};

const TaskFooterBtn = ({ closeDialog, updateTodoTask, createTask }: props) => {
  const { loading, todoInfo } = useTodoStore((state) => state);
  return (
    <div className="self-end mt-auto bg-cusGray/60 shadow-t-md py-3 px-6 md:rounded-b-xl flex justify-end items-center gap-3 w-full">
      <Button
        onClick={closeDialog}
        disabled={loading}
        variant="outline"
        className="bg-white rounded-2xl"
      >
        Cancel
      </Button>
      {todoInfo.history.length > 0 ? (
        <Button
          disabled={checkNullObject(todoInfo) || loading}
          className="bg-fuchsia-800 rounded-2xl"
          variant="default"
          onClick={updateTodoTask}
        >
          Update Task {loading && <Loader2Icon className="animate-spin" />}
        </Button>
      ) : (
        <Button
          disabled={checkNullObject(todoInfo) || loading}
          className="bg-fuchsia-800 rounded-2xl"
          variant="default"
          onClick={createTask}
        >
          Create {loading && <Loader2Icon className="animate-spin" />}
        </Button>
      )}
    </div>
  );
};

export default TaskFooterBtn;
