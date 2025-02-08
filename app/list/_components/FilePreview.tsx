"use client";
import { file } from "@/public/store/TodoSlice";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeftIcon, ArrowRightIcon, X } from "lucide-react";
import { Document, Page } from "react-pdf";
import { Button } from "@/components/ui/button";

type docs = {
  pageLimit: number;
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
  const [page, setPage] = useState(1);
  const [docInfo, setDocInfo] = useState<docs>({
    pageLimit: 0,
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
          className="flex flex-col text-cusBlack mt-5 md:mt-0 relative group h-[170px] md:h-[130px] w-full md:w-[200px]"
        >
          <div className="flex justify-between items-center">
            {file.fileType.includes("application/pdf") && (
              <button
                onClick={() =>
                  docInfo.pageLimit > 0 && handleDocInfo(file?.fileLink)
                }
                className="w-fit h-fit bg-cusBlack text-white hidden md:block rounded-md py-[6px] px-2"
              >
                <ArrowDown size={18} />
              </button>
            )}
            <button
              onClick={() => deleteFile(file.path)}
              className="my-1 hover:scale-110 bg-cusBlack text-white w-fit ml-auto self-end p-1 rounded-md hover:scale-110 transition-all"
            >
              <X size={20} />
            </button>
          </div>
          {file.fileType.includes("image/") ? (
            <Link
              href={file.fileLink}
              target="_blank"
              className="w-full h-full flex"
            >
              <Image
                src={file?.fileLink}
                alt={file.path}
                priority
                width={200}
                height={120}
                placeholder="blur"
                blurDataURL="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                className="h-full w-full md:w-[300px] object-cover rounded-md  group-hover:grayscale-[0.8] transition-all"
              />
            </Link>
          ) : (
            <div>
              {/* // NOTE: Document Image preview */}
              <div className="w-full h-[120px] hidden md:block cursor-pointer">
                <Document
                  onLoadSuccess={(pdf) =>
                    setDocInfo((prev) => ({ ...prev, pageLimit: pdf.numPages }))
                  }
                  className="overflow-hidden document-viewer"
                  file={file?.fileLink}
                >
                  <Page pageIndex={0} />
                </Document>
              </div>
              {/* NOTE: This preview is for mobile */}
              <div className="flex md:hidden relative w-full h-[150px] md:h-[130px]">
                <Link
                  className="w-full rounded-md bg-cusBlack text-white text-lg font-bold h-full flex justify-center items-center"
                  href={file.fileLink}
                  target="_blank"
                >
                  This is a pdf file
                </Link>
              </div>
            </div>
          )}
        </div>
      ))}
      {/* Document Viewer Comp */}
      {docInfo.showPreview && (
        <div className="fixed top-0 left-0 h-full hidden md:flex flex-col gap-8 w-full bg-slate-100 p-3 md:p-5">
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
          {/* INFO: Navigation Buttons */}
          <div className="flex justify-between flex-wrap items-center w-full md:px-4">
            <Button
              disabled={page === 1}
              onClick={() => setPage((prev) => (prev - 1 <= 1 ? 1 : prev - 1))}
              className="w-auto! h-auto!"
            >
              <ArrowLeftIcon size={20} />
            </Button>
            <Button
              disabled={page === docInfo.pageLimit}
              onClick={() =>
                setPage((prev) =>
                  prev + 1 >= docInfo.pageLimit ? docInfo.pageLimit : prev + 1,
                )
              }
              className="w-auto! h-auto!"
            >
              <ArrowRightIcon size={20} />
            </Button>
          </div>
          {/* INFO: Document Preview */}
          <div className="flex-1 flex h-full w-full overflow-y-auto">
            <Document className="w-full h-full" file={docInfo.link}>
              <Page scale={0.7} pageNumber={page} />
            </Document>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilePreview;
