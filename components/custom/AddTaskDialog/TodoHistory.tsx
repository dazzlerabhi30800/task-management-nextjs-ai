import { formatTime } from "@/lib/utils";
import { history } from "@/public/store/TodoSlice";
import React from "react";

type todoHistory = {
  data: Array<history>;
};

const TodoHistory = ({ data }: todoHistory) => {
  return (
    <div className="flex flex-col h-full w-full md:w-[33%]">
      <h1 className="bg-white shadow-lg text-lg font-bold text-cusBlack p-4 w-full">
        Activity
      </h1>
      <div className="flex flex-col flex-1 p-4 h-full w-full overflow-y-auto gap-3 bg-pink-100/50">
        {data.map((item, index) => (
          <div
            className="flex item-scenter justify-between gap-4 text-[10px] md:text-xs"
            key={index}
          >
            <p className="text-gray-700">{item.actionType}</p>
            <p className="text-gray-500"> {formatTime(new Date(item.time))}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoHistory;
