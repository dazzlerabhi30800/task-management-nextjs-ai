import { supabase } from "@/config/SupabaseConfig";
import { file, history, todo, todoItem } from "@/public/store/TodoSlice";
import { toast } from "sonner";
import { checkFilterDate, compressFile, getMills } from "./utils";
import axios from "axios";

// NOTE: fetch todos from the database by user (id)
export const getTodos = async (id: string) => {
  if (!id) return;
  const { data, error } = await supabase
    .from("Todos")
    .select("*")
    .eq("createdBy", id);
  return error ? [] : data;
};

// NOTE: to generate ai prompt from the tasks
export const getAiPrompt = async (todoPrompt: string) => {
  if (!todoPrompt || todoPrompt.length === 0 || todoPrompt === "")
    return "There are no task dued for today";
  const result = await axios.post("/api/get-todo", {
    prompt: todoPrompt,
  });
  return result?.data ? result.data.result : "";
};

// NOTE: format todos to group by column (todos, in-progress, completedl);
export const formatTodosByColumn = async (id: string) => {
  const todos = await getTodos(id);
  if (!todos) return;
  const todoPrompt = todos
    ?.sort((a, b) => {
      return getMills(a.dueDate as Date) - getMills(b.dueDate as Date);
    })
    .filter((todo) => checkFilterDate(todo.dueDate, new Date(Date.now())))
    ?.map((todo) => todo.text)
    .join("\n");

  if (!Array.isArray(todos)) return [];
  const newTodos = todos.reduce((acc, item) => {
    if (!acc[item.status]) {
      acc[item.status] = {};
      acc[item.status].id = item.status;
      acc[item.status].todos = [];
    }
    acc[item.status].todos.push(item);
    return acc;
  }, {});

  const columnOrder: Array<string> = ["to-do", "in-progress", "completed"];
  for (const column of columnOrder) {
    if (!newTodos[column]) {
      newTodos[column] = {
        id: column,
        todos: [],
      };
    } else {
      newTodos[column].todos.sort(
        (a: todo, b: todo) => (a?.position as number) - (b?.position as number),
      );
    }
  }
  const sortedTodos = Array.from(Object.values(newTodos) as todoItem[])?.sort(
    (a: todoItem, b: todoItem) => {
      return columnOrder.indexOf(a?.id) - columnOrder.indexOf(b?.id);
    },
  );
  return { formattedTodos: sortedTodos, todoPrompt };
};

// NOTE: upload files on cloud storage
export const uploadFile = async (file: File) => {
  let fileToUpload = file;
  if (file.type.includes("image")) {
    fileToUpload = (await compressFile(file, 300)) as File;
  }
  const { data } = await supabase.storage
    .from("todofiles")
    .upload(`todoFiles/${file.name}-${Date.now()}`, fileToUpload);
  if (data) {
    const { data: fileUrl } = supabase.storage
      .from("todofiles")
      .getPublicUrl(data.path);
    return {
      fileLink: fileUrl.publicUrl,
      path: data.path,
      fileType: file.type,
    };
  } else {
    return null;
  }
};

// NOTE: delete todo document from the database, it's for multiple actions;
export const deleteDocument = async (id: string) => {
  await supabase.from("Todos").delete().eq("id", id);
};

// NOTE: update task status (todo, in-progress, completed), this also handles the change in status by dragging & dropping
export const updateTaskStatus = async (
  todo: todo,
  type: string,
  value: string,
) => {
  const newHistory = [
    ...todo.history,
    {
      actionType: `${type} changed from ${todo.status} to ${value}`,
      time: Date.now(),
    },
  ];
  const { error } = await supabase
    .from("Todos")
    .update({
      status: value,
      history: newHistory,
    })
    .eq("id", todo.id);
  if (!error) {
    toast.success("Task Status Updated Succefully", {
      duration: 1500,
    });
  }
};

// NOTE: delete files from the cloud storage
export const deleteFileFromCloud = async (
  path: string,
  id: string,
  newFileUrl: Array<file>,
  todoHistory: Array<history>,
) => {
  if (!path || !id) return;
  const { data } = await supabase.storage.from("todofiles").remove([path]);
  const newHistory = [
    ...todoHistory,
    { actionType: "File deleted", time: Date.now() },
  ];
  if (data) {
    const { error: todoErr } = await supabase
      .from("Todos")
      .update({
        fileUrl: [...newFileUrl],
        history: newHistory,
      })
      .eq("id", id)
      .select("fileUrl");
    if (!todoErr) {
      toast.success("File delete successfully");
    }
  }
};

// NOTE: update task position if the task is dragged within the list
export const updateTaskPosition = async (todoId: string, position: number) => {
  const { error } = await supabase
    .from("Todos")
    .update({
      position: position,
    })
    .eq("id", todoId);
  if (error) {
    toast.error(error.message);
  }
};
