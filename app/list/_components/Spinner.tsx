import { Loader2 } from "lucide-react";
import React from "react";

const Spinner = ({ additionalStyles }: { additionalStyles?: string }) => {
  return (
    <div
      className={`flex-1 flex justify-center items-center h-inherit ${additionalStyles}`}
    >
      <Loader2 className="animate-spin" size={40} />
    </div>
  );
};

export default Spinner;
