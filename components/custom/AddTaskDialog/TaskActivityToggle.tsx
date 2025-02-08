import { Button } from "@/components/ui/button";
import { useActionStore } from "@/public/store/ActionSlice";
import React from "react";

const TaskActivityToggle = () => {
  const { showComp, setShowComp } = useActionStore((state) => state);
  return (
    <div className="flex items-center gap-4 py-2 px-4 bg-slate-100 shadow-md">
      <Button
        onClick={() => setShowComp(false)}
        variant={showComp ? "outline" : "default"}
        className="rounded-3xl"
      >
        Details
      </Button>
      <Button
        onClick={() => setShowComp(true)}
        variant={showComp ? "default" : "outline"}
        className="rounded-3xl"
      >
        Activity
      </Button>
    </div>
  );
};

export default TaskActivityToggle;
