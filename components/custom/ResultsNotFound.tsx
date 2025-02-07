import Image from "next/image";
import React from "react";

const ResultsNotFound = () => {
  return (
    <div className="flex justify-center items-center flex-1">
      <Image
        src={"/results-not-found.png"}
        alt="results not found"
        style={{ width: "auto", height: "auto" }}
        width={300}
        height={100}
        priority={true}
        className="object-cover"
      />
    </div>
  );
};

export default ResultsNotFound;
