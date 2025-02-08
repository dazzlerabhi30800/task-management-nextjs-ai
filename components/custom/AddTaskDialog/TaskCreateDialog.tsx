"use client";
import React, { useEffect, useRef, useState } from "react";
import { useActionStore } from "@/public/store/ActionSlice";
import { useTodoStore } from "@/public/store/TodoSlice";
import { useUserStore } from "@/public/store/UserSlice";
import TodoHistory from "./TodoHistory";
import { deleteFileFromCloud } from "@/lib/SupabaseFunc";
import useResize from "@/lib/useResize";
import { toast } from "sonner";
import TaskHeader from "./TaskHeader";
import TaskFields from "./TaskFields";
import TaskActivityToggle from "./TaskActivityToggle";
import TaskFooterBtn from "./TaskFooterBtn";

const TaskCreateDialog = () => {
  const { setShowTaskDialog, showComp, showTaskDialog } = useActionStore(
    (state) => state
  );
  const { resize } = useResize();
  const [files, setFiles] = useState<Array<File>>([]);
  const {
    addTodo,
    todos,
    setTodos,
    todoInfo,
    setTodoInfoInitial,
    setTodoInfo,
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
        <TaskHeader closeDialog={closeDialog} />

        {/* NOTE:  Button to toggle history & todo info */}
        {resize < 768 && <TaskActivityToggle />}
        {/*NOTE: Todo Info Form */}
        <div className="flex flex-1 overflow-y-auto">
          {/* NOTE: Todo Info */}
          <TaskFields
            handleFileUpload={handleFileUpload}
            deleteFile={deleteFile}
            todoRef={todoRef}
            files={files}
            setFiles={setFiles}
          />

          {/* NOTE: Todo History */}
          {showComp && todoInfo.history.length > 0 && (
            <TodoHistory data={todoInfo.history} />
          )}
        </div>
        {/* Buttons */}
        <TaskFooterBtn
          closeDialog={closeDialog}
          updateTodoTask={updateTodoTask}
          createTask={createTask}
        />
      </div>
    </div>
  );
};

export default TaskCreateDialog;
