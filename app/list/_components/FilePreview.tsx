"use client";
import React, { useState } from "react";
import { file } from "@/public/store/TodoSlice";
import { ArrowDown, ArrowLeft, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageComp from "./ImageComp";
import PdfPreview from "./PdfPreview";
import { Document, Page } from "react-pdf";
// import { BlobProvider } from "@react-pdf/renderer";

export type docs = {
  link: string;
  showPreview: boolean;
  totalPages?: number;
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
    totalPages: 0,
  });

  const [page, setPage] = useState(1);

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
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center md:px-5">
            <Button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              <ArrowLeft />
            </Button>
            <Button
              disabled={page === docInfo.totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              <ArrowRight />
            </Button>
          </div>
          {/* INFO: Document Preview */}
          <div className="flex-1 flex h-full w-full overflow-y-auto">
            <Document
              file={docInfo.link}
              loading={<div>Loading...</div>}
              onLoadSuccess={(data) =>
                setDocInfo((prev) => ({
                  ...prev,
                  totalPages: data._pdfInfo.numPages,
                }))
              }
              className="w-full"
            >
              <Page pageNumber={page} error={"Error"} />
            </Document>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilePreview;
