"use client";
import React, { useState } from "react";
import { file } from "@/public/store/TodoSlice";
import { ArrowDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageComp from "./ImageComp";
import PdfPreview from "./PdfPreview";

export type docs = {
  link: string;
  showPreview: boolean;
};

const FilePreview = ({
  todoFileArray,
  deleteFile,
}: {
  todoFileArray: Array<file>;
  deleteFile: (path: string) => void;
}) => {
  const [docInfo, setDocInfo] = useState<docs>({
    link: "",
    showPreview: false,
  });

  const handleDocInfo = (link: string) => {
    setDocInfo({
      ...docInfo,
      link: link,
      showPreview: true,
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:flex-wrap gap-8 md:gap-10 pb-10">
      {todoFileArray.map((file, index) => (
        // NOTE: Buttons to close Show Preview & Delete File
        <div
          key={index}
          className="flex flex-col text-cusBlack mt-3 md:mt-0 relative group w-full md:w-[200px]"
        >
          <div className="flex justify-between items-center">
            {file.fileType.includes("application/pdf") && (
              <button
                onClick={() => handleDocInfo(file?.fileLink)}
                className="w-fit h-fit bg-cusBlack text-white rounded-md py-[6px] px-2"
              >
                <ArrowDown size={18} />
              </button>
            )}
            <button
              onClick={() => deleteFile(file.path)}
              className="my-1 hover:scale-110 bg-cusBlack text-white ml-auto w-fit p-1 rounded-md hover:scale-110 transition-all"
            >
              <X size={20} />
            </button>
          </div>
          {file.fileType.includes("image/") ? (
            <ImageComp path={file.path} fileLink={file.fileLink} />
          ) : (
            <PdfPreview fileLink={file.fileLink} />
          )}
        </div>
      ))}
      {/* Document Viewer Comp */}
      {docInfo.showPreview && (
        <div className="fixed top-0 left-0 h-full flex flex-col gap-8 w-full bg-slate-100 p-3 md:p-5">
          {/* INFO: close Button */}
          <div className="flex justify-between flex-wrap items-center w-full md:px-4">
            <Button onClick={() => window.open(docInfo.link)}>
              <ArrowDown size={20} />
            </Button>
            <Button
              onClick={() =>
                setDocInfo((prev) => ({ ...prev, showPreview: false }))
              }
              className="w-fit self-end"
            >
              <X size={20} />
            </Button>
          </div>
          {/* INFO: Document Preview */}
          <div className="flex-1 flex h-full w-full overflow-y-auto">
            <iframe
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
              key={docInfo.link}
              referrerPolicy="no-referrer"
              src={`https://docs.google.com/viewer?url=${docInfo.link}&embedded=true`}
              width="100%"
              height="100%"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilePreview;
