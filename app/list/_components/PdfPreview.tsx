import React, { useState } from "react";

const PdfPreview = ({ fileLink }: { fileLink: string }) => {
  // NOTE: This State is to show loader when pdf file is loading
  const [isDoc, setIsDoc] = useState(false);
  return (
    <div className="flex w-full">
      {/* // NOTE: Document Image preview */}
      <div
        className={`w-full h-[170px] md:h-[130px] cursor-pointer  ${
          !isDoc ? "animate-pulse bg-slate-200" : ""
        } `}
      >
        <iframe
          onLoad={() => setIsDoc(true)}
          src={`https://docs.google.com/viewer?url=${fileLink}&embedded=true`}
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

export default PdfPreview;
