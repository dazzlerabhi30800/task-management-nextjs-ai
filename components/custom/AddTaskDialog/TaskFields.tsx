import React, { useCallback } from "react";
import { useTodoStore } from "@/public/store/TodoSlice";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import DueDatePicker from "./DueDatePicker";
import { SelectCategory } from "@/app/list/_components/SelectCategory";
// import FilePreview from "@/app/list/_components/FilePreview";
import { useDropzone } from "react-dropzone";
import dynamic from "next/dynamic";
import Spinner from "@/app/list/_components/Spinner";

type props = {
  todoRef: React.RefObject<HTMLDivElement | null>;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  files: File[];
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  deleteFile: (path: string) => Promise<void>;
};

const TaskFields = ({
  todoRef,
  files,
  setFiles,
  handleFileUpload,
  deleteFile,
}: props) => {
  const { todoInfo, setTodoInfo } = useTodoStore((state) => state);

  // NOTE: -->  file preview dynamically
  const DynamicFilePreview = dynamic(
    () => import("@/app/list/_components/FilePreview"),
    {
      ssr: false,
      loading: () => <></>,
    },
  );

  //NOTE: Handle Drop on drop-zone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (files.length > 3) return;
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  //NOTE: drag & drop zones variables
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    maxFiles:
      todoInfo.fileUrl.length === 0 && files.length === 0
        ? 3
        : Math.abs(todoInfo.fileUrl.length - files.length),
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "application/pdf": [],
    },
  });

  return (
    <div
      ref={todoRef}
      className="flex flex-1 h-full overflow-y-auto flex-col shadow-r-md"
    >
      {/* NOTE: Task Input Info */}
      <div className="mt-8 px-5 flex flex-col gap-3 pb-5">
        <input
          type="text"
          value={todoInfo.text}
          onChange={(e) => setTodoInfo({ ...todoInfo, text: e.target.value })}
          placeholder="Title"
          className="py-2 px-4 rounded-lg bg-cusGray/30 border border-cusGray w-full focus:outline-none focus:border-black text-sm md:text-base"
        />
        <ReactQuill
          className="bg-cusGray/70 mt-2 min-h-32 border-none overflow-hidden shadow-md"
          theme="snow"
          value={todoInfo.description}
          onChange={(value) => setTodoInfo({ ...todoInfo, description: value })}
        />
        {/* NOTE: Status, date & type picker */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5 text-gray-700 text-sm">
          {/* NOTE: Task Category */}
          <div className="flex flex-col gap-3">
            <h4 className="ml-3">Task Category</h4>
            <div className="flex items-center gap-3">
              <span
                onClick={() => {
                  setTodoInfo({ ...todoInfo, category: "Work" });
                }}
                className={`${
                  todoInfo.category === "Work"
                    ? "border-transparent bg-cusBlack text-white hover:text-gray-300"
                    : "hover:text-black hover:border-black"
                } border border-gray-400 rounded-3xl py-2 px-4 cursor-pointer `}
              >
                Work
              </span>
              <span
                onClick={() => {
                  setTodoInfo({ ...todoInfo, category: "Personal" });
                }}
                className={`${
                  todoInfo.category === "Personal"
                    ? "border-transparent bg-cusBlack text-white hover:text-gray-300"
                    : "hover:text-black hover:border-black"
                } border border-gray-400 rounded-3xl py-2 px-4 cursor-pointer `}
              >
                Personal
              </span>
            </div>
          </div>
          {/* NOTE: Due Date */}
          <div className="flex flex-col gap-3">
            <h3>Due On*</h3>
            <DueDatePicker
              dateValue={todoInfo.dueDate && new Date(todoInfo.dueDate)}
            />
          </div>
          {/* NOTE: Task Status */}
          <div className="flex flex-col gap-3">
            <h4>Task Status</h4>
            <SelectCategory width={"100%"} />
          </div>
        </div>
        {todoInfo.fileUrl.length < 3 && (
          <div
            {...getRootProps()}
            className="mt-8 h-40 border-2 border-dashed border-red-400 flex justify-center items-center px-10"
          >
            {/* NOTE: File Upload */}
            <input
              {...getInputProps()}
              id="taskFile"
              className="hidden"
              multiple
              onChange={handleFileUpload}
              type="file"
              accept="image/*,application/pdf"
            />
            <label
              htmlFor="taskFile"
              className="w-full text-sm md:text-base justify-center items-center text-center flex bg-cusGray/70 py-3 px-4 border-gray-400 shadow-md rounded-md"
            >
              Drop your files or{" "}
              <span className="text-blue-400 hover:underline italic ml-2">
                {files[0]
                  ? `${files[0].name}`
                  : `you can upload ${3 - todoInfo.fileUrl.length} more files`}
              </span>
            </label>
          </div>
        )}
        {/* NOTE: Files If the exists */}
        {/* <FilePreview todoFileArray={todoInfo.fileUrl} deleteFile={deleteFile} /> */}
        <DynamicFilePreview
          todoFileArray={todoInfo.fileUrl}
          deleteFile={deleteFile}
        />
      </div>
    </div>
  );
};

export default TaskFields;
