"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../ui/button";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import DueDatePicker from "./DueDatePicker";
import { SelectCategory } from "@/app/list/_components/SelectCategory";
import { useActionStore } from "@/public/store/ActionSlice";
import { useTodoStore } from "@/public/store/TodoSlice";
import { checkNullObject } from "@/lib/utils";
import { useUserStore } from "@/public/store/UserSlice";
import TodoHistory from "./TodoHistory";
import { deleteFileFromCloud } from "@/lib/SupabaseFunc";
import useResize from "@/lib/useResize";
import { Loader2Icon, X } from "lucide-react";
import FilePreview from "@/app/list/_components/FilePreview";
import { toast } from "sonner";

const TaskCreateDialog = () => {
  const { setShowTaskDialog, showComp, setShowComp, showTaskDialog } =
    useActionStore((state) => state);
  const { resize } = useResize();
  const [files, setFiles] = useState<Array<File>>([]);
  const {
    addTodo,
    todos,
    setTodos,
    todoInfo,
    setTodoInfoInitial,
    setTodoInfo,
    loading,
    updateTask,
    setHistory,
  } = useTodoStore((state) => state);
  const { user } = useUserStore((state) => state);

  // NOTE: closeTaskDialog after some action is done;
  const closeDialog = () => {
    setTodoInfoInitial();
    setFiles([]);
    setShowTaskDialog();
    setTimeout(() => {
      setTodoInfoInitial();
    }, 100);
  };

  const createTask = async () => {
    const result = await addTodo(
      todoInfo,
      user?.id as string,
      "created",
      files
    );
    if (result) {
      closeDialog();
    }
  };

  const updateTodoTask = async () => {
    const result = await updateTask(
      todoInfo,
      "updated",
      user?.id as string,
      files
    );
    if (result) {
      closeDialog();
    }
  };

  // NOTE: To delete file
  const deleteFile = async (path: string) => {
    setTodoInfo({
      ...todoInfo,
      fileUrl: todoInfo.fileUrl.filter((item) => item.path !== path),
    });
    const newFileUrl = [...todoInfo.fileUrl].filter(
      (item) => item.path !== path
    );
    const newTodos = todos.map((item) => {
      if (item.id === todoInfo.status) {
        const newTodos = [...item.todos];
        const findIndex = newTodos.findIndex((todo) => todo.id === todoInfo.id);
        newTodos[findIndex].fileUrl = [...newFileUrl];
        return { ...item, todos: newTodos };
      }
      return item;
    });
    setTodos(newTodos);
    todoInfo.history.push({ actionType: "file deleted", time: Date.now() });
    await deleteFileFromCloud(
      path,
      todoInfo.id as string,
      newFileUrl,
      todoInfo.history
    );
  };

  // NOTE: handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHistory({
      actionType:
        todoInfo.fileUrl.length > 0 ? "Files updated" : "File uploaded",
      time: Date.now(),
    });
    if (e.target.files) {
      const checkFileType = [...e.target.files].every(
        (file) => file.type.includes("image/") || file.type.includes("pdf")
      );
      if (!checkFileType) {
        toast.error("you can upload only image for pdf files");
      }
      if (todoInfo.fileUrl.length === 0 && e.target.files.length > 3) {
        toast.error("You can't upload more than 3 files");
      } else if (todoInfo.fileUrl.length + e.target.files.length > 3) {
        toast.error("You can't upload more than 3 files");
      }
      setFiles([...e.target.files]);
    }
  };
  

  // Ref for todo input wrapper
  const todoRef = useRef<HTMLDivElement | null>(null);

  // NOTE: this hook will scroll the task dialog to top, as the user closed the dialog box scrolled to bottom
  useEffect(() => {
    if (!showTaskDialog || !todoRef.current) return;
    todoRef.current.scrollTo(0, 0);
  }, [showTaskDialog]);

  return (
    <div
      className={`fixed w-full overflow-hidden bottom-0 md:top-0 md:bottom-initial left-0 h-full bg-black/70 flex  justify-center items-end md:items-center transition-all ${
        showTaskDialog ? "opacity-100 z-40" : "opacity-0 -z-10"
      }`}
    >
      <div
        className={`rounded-t-xl md:rounded-b-xl ${
          showTaskDialog ? "translate-y-0" : "translate-y-[110%]"
        }  bg-white shadow-lg w-full md:w-[95%] lg:w-[90%] max-w-[1350px] h-[90vh] md:h-[85vh] flex flex-col overflow-hidden addTransition`}
      >
        {/* Header */}
        <div className="p-3 md:p-5 border-b border-cusGray shadow-b-md text-cusBlack flex justify-between items-center">
          <h1 className="font-bold text-2xl md:text-4xl">Create Task</h1>
          <Button
            onClick={closeDialog}
            variant="outline"
            className="hover:text-black"
          >
            <X />
          </Button>
        </div>
        {/* NOTE:  Button to toggle history & todo info */}
        {resize < 768 && (
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
        )}
        {/*NOTE: Todo Info Form */}
        <div className="flex flex-1 overflow-y-auto">
          {/* NOTE: Todo Info */}
          <div
            ref={todoRef}
            className="flex flex-1 h-full overflow-y-auto flex-col shadow-r-md"
          >
            {/* NOTE: Task Input Info */}
            <div className="mt-8 px-5 flex flex-col gap-3 pb-5">
              <input
                type="text"
                value={todoInfo.text}
                onChange={(e) =>
                  setTodoInfo({ ...todoInfo, text: e.target.value })
                }
                placeholder="Title"
                className="py-2 px-4 rounded-lg bg-cusGray/30 border border-cusGray w-full focus:outline-none focus:border-black text-sm md:text-base"
              />
              <ReactQuill
                className="bg-cusGray/70 mt-2 min-h-32 border-none overflow-hidden shadow-md"
                theme="snow"
                value={todoInfo.description}
                onChange={(value) =>
                  setTodoInfo({ ...todoInfo, description: value })
                }
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
                <div className="mt-8">
                  {/* NOTE: File Upload */}
                  <input
                    multiple
                    onChange={handleFileUpload}
                    type="file"
                    accept="image/*,application/pdf"
                    id="taskFile"
                    className="hidden"
                  />
                  <label
                    htmlFor="taskFile"
                    className="w-full text-sm md:text-base justify-center items-center text-center flex bg-cusGray/70 py-3 px-4 border-gray-400 shadow-md rounded-md"
                  >
                    Drop your files or{" "}
                    <span className="text-blue-400 hover:underline italic ml-2">
                      {files[0]
                        ? `${files[0].name}`
                        : `you can upload ${
                            3 - todoInfo.fileUrl.length
                          } more files`}
                    </span>
                  </label>
                </div>
              )}
              {/* NOTE: Files If the exists */}
              <FilePreview
                todoFileArray={todoInfo.fileUrl}
                deleteFile={deleteFile}
              />
            </div>
          </div>
          {/* NOTE: Todo History */}
          {showComp && todoInfo.history.length > 0 && (
            <TodoHistory data={todoInfo.history} />
          )}
        </div>
        {/* Buttons */}
        <div className="self-end mt-auto bg-cusGray/60 shadow-t-md py-3 px-6 md:rounded-b-xl flex justify-end items-center gap-3 w-full">
          <Button
            onClick={closeDialog}
            disabled={loading}
            variant="outline"
            className="bg-white rounded-2xl"
          >
            Cancel
          </Button>
          {todoInfo.history.length > 0 ? (
            <Button
              disabled={checkNullObject(todoInfo) || loading}
              className="bg-fuchsia-800 rounded-2xl"
              variant="default"
              onClick={updateTodoTask}
            >
              Update Task {loading && <Loader2Icon className="animate-spin" />}
            </Button>
          ) : (
            <Button
              disabled={checkNullObject(todoInfo) || loading}
              className="bg-fuchsia-800 rounded-2xl"
              variant="default"
              onClick={createTask}
            >
              Create {loading && <Loader2Icon className="animate-spin" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCreateDialog;
