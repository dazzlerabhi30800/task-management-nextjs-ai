import { ArrowUpDown } from "lucide-react";
import React from "react";

const TaskTableHeader = () => {
  return (
    <div className="hidden md:grid grid-cols-10 text-gray-400 font-semibold px-8 mt-10 md:mt-0">
      <h3 className="col-span-3">Task Name</h3>
      <h3 className="col-span-2 flex items-center gap-1">
        Due Date <ArrowUpDown size={15} />
      </h3>
      <h3 className="col-span-2">Task Status</h3>
      <h3 className="col-span-3">Task Category</h3>
    </div>
  );
};

export default TaskTableHeader;
