import { X } from "lucide-react";
import React from "react";
import { Button } from "../../ui/button";

const TaskHeader = ({ closeDialog }: { closeDialog: () => void }) => {
  return (
    <div className="p-3 md:p-5 border-b border-cusGray shadow-b-md text-cusBlack flex justify-between items-center">
      <h1 className="font-bold text-2xl md:text-4xl">Create Task</h1>
      <Button
        onClick={closeDialog}
        variant="outline"
        className="hover:text-black"
      >
        <X />
      </Button>
    </div>
  );
};

export default TaskHeader;
