import { supabase } from "@/config/SupabaseConfig";
import {
  deleteDocument,
  formatTodosByColumn,
  getAiPrompt,
  uploadFile,
} from "@/lib/SupabaseFunc";
import { getMills } from "@/lib/utils";
import { fileInfo } from "@/type";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type history = {
  actionType: string;
  time: Date | string | number;
};

export type file = {
  fileLink: string;
  path: string;
  fileType: string;
};

export type todo = {
  id?: string;
  created_at?: string | Date;
  createdBy?: string;
  text: string;
  dueDate: Date | undefined | string;
  status: string;
  category: string;
  description: string;
  history: Array<history>;
  fileUrl: Array<file>;
  position?: number;
};

export type todoItem = {
  id: string;
  todos: Array<todo>;
};
export type todos = Array<todoItem>;

export const initialTodoInfoState: todo = {
  text: "",
  dueDate: undefined,
  status: "",
  category: "",
  description: "",
  history: [],
  fileUrl: [],
};

interface todoStore {
  todos: todos;
  dummyTodos: todos;
  todoInfo: todo;
  loading: boolean;
  historyRecord: history | null;
  todoSearchString: string;
  debouncedTodoString: string;
  multipleActionData: Array<todo>;
  fetchTodoAi: (prompt: string) => void;
  aiTodoPrompt: string;
  setMultipleActionData: (todos: Array<todo>) => void;
  setLoading: (value: boolean) => void;
  setTodoInfo: (todoInfo: todo) => void;
  setDebouncedTodoString: (searchString: string) => void;
  filterTodosBySearchString: (searchString: string) => void;
  setTodoInfoInitial: () => void;
  setTodos: (todos: todos) => void;
  setDummyTodos: (todos: todos) => void;
  setTodosWithDummy: (todos: todos) => void;
  addTodo: (
    todo: todo,
    userId: string,
    type: string,
    file: Array<File>
  ) => Promise<boolean>;
  fetchTodos: (userId: string) => void;
  updateTodo: (
    todo: todo,
    actionType: string,
    value: string,
    userId: string
  ) => void;
  updateTask: (
    todo: todo,
    actionType: string,
    userId: string,
    files: Array<File>
  ) => Promise<boolean>;
  filterTodos: (filterKey: string) => void;
  sortTodos: (order: string) => void;
  setHistory: (data: history) => void;
  deleteTask: (todo: todo, userId: string) => void;
  performMultipleActions: (
    type: string,
    userId: string,
    status?: string
  ) => void;
}

export const useTodoStore = create<todoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      todoSearchString: "",
      dummyTodos: [],
      aiTodoPrompt: "Generating",
      multipleActionData: [],
      loading: false,
      historyRecord: {
        actionType: "",
        time: Date.now(),
      },
      // NOTE: this will function will genereate the Ai Prompt based on the todo titles
      fetchTodoAi: async (prompt: string) => {
        if (prompt.length === 0) return;
        const result = await getAiPrompt(prompt);
        if (result) {
          set({ aiTodoPrompt: result, loading: false });
        }
      },
      setMultipleActionData: (todos: Array<todo>) => {
        set({ multipleActionData: todos });
      },
      setHistory: (data: history) => {
        set({ historyRecord: data });
      },
      debouncedTodoString: "",
      setLoading: (value) => set({ loading: value }),
      todoInfo: {
        text: "",
        dueDate: undefined,
        status: "",
        category: "",
        description: "",
        history: [],
        fileUrl: [],
      },
      setTodoInfo: (todoInfo) => {
        const newTodoInfo = { ...todoInfo };
        delete newTodoInfo.created_at;
        delete newTodoInfo.createdBy;
        delete newTodoInfo.position;
        set({ todoInfo: newTodoInfo });
      },
      //NOTE: change the todoInfo for taskDialog data to initial empty states
      setTodoInfoInitial: () => {
        const newTodoInfo = { ...get().todoInfo };
        delete newTodoInfo.created_at;
        delete newTodoInfo.createdBy;
        delete newTodoInfo.position;
        delete newTodoInfo.id;
        set({
          todoInfo: initialTodoInfoState,
        });
      },
      setDebouncedTodoString: (searchString: string) =>
        set({ debouncedTodoString: searchString }),
      setTodos: (todos) => {
        set({ todos });
      },
      // NOTE: this dummy wil act as backup for filtering & sorting tasks
      setTodosWithDummy: (todos) => {
        set({ todos: todos, dummyTodos: todos });
      },
      setDummyTodos: (todos) => {
        set({ dummyTodos: todos });
      },
      // NOTE : to create a new task
      addTodo: async (todo, userId: string, type, files) => {
        const todos = get().todos.filter((item) => item.id === todo.status)[0]
          .todos;
        const historyData = [{ actionType: type, time: Date.now() }];
        let uploadFileData = [];
        // INFO: to check if user has uploaded a file then compress & upload it
        if (files.length > 0) {
          for (let i = 0; i < files.length; i++) {
            const uploadedFile = await uploadFile(files[i]);
            uploadFileData.push({ ...uploadedFile });
          }
        }
        const { error } = await supabase.from("Todos").insert({
          text: todo.text,
          dueDate: todo.dueDate,
          status: todo.status,
          category: todo.category,
          description: todo.description,
          history: historyData,
          fileUrl: uploadFileData,
          createdBy: userId,
          position: todos.length + 1,
        });
        if (!error) {
          toast("Your task created");
          get().fetchTodos(userId);
          return true;
        } else {
          return false;
        }
      },
      // NOTE: fetch todos when user is logged in
      fetchTodos: async (userId) => {
        set({ loading: true });
        const { formattedTodos, todoPrompt }: any = await formatTodosByColumn(
          userId
        );
        set({
          todos: formattedTodos as todos,
          dummyTodos: formattedTodos as todos,
          todoInfo: initialTodoInfoState,
        });
        get().fetchTodoAi(todoPrompt);
      },
      // NOTE: this is just for status & category update
      updateTodo: async (todo, actionType, status, userId) => {
        const historyObj = {
          actionType: actionType,
          time: Date.now(),
        };

        const newHistoryRecord = get().historyRecord
          ? {
              ...get().historyRecord,
              time: Date.now(),
            }
          : historyObj;
        const newHistory = [...todo.history, { ...newHistoryRecord }];
        const { error } = await supabase
          .from("Todos")
          .update({ history: newHistory, [actionType as string]: status })
          .eq("id", todo.id);
        if (!error) {
          get().fetchTodos(userId);
          return true;
        }
        return false;
      },
      // NOTE: This is for the whole task states
      updateTask: async (todo, actionType, userId, files) => {
        const historyObj = {
          actionType: `task ${actionType} at`,
          time: Date.now(),
        };
        const todoFiles = [...todo.fileUrl];
        if (files.length > 0) {
          historyObj.actionType = "files updated";
          for (let i = 0; i < files.length; i++) {
            const uploadedFile = await uploadFile(files[i]);
            todoFiles.push({ ...uploadedFile } as fileInfo);
          }
        }
        const newHistory = [...todo.history, { ...historyObj }];
        const { error } = await supabase
          .from("Todos")
          .update({
            history: newHistory,
            text: todo.text,
            category: todo.category,
            description: todo.description,
            dueDate: todo.dueDate,
            status: todo.status,
            fileUrl: todoFiles,
          })
          .eq("id", todo.id);
        if (!error) {
          toast("your todo is updated");
          get().fetchTodos(userId);
          return true;
        }
        return false;
      },
      // NOTE: filter tasks, if task title includes search string
      filterTodos: (filterKey: string) => {
        set({ loading: true });
        const newTodos = [...get().dummyTodos].map((item) => {
          if (filterKey === "all") {
            return item;
          } else {
            let filteredTodos = item.todos.filter(
              (item) => item.status === filterKey
            );
            return { ...item, todos: filteredTodos };
          }
        });
        set({ todos: newTodos, loading: false });
      },
      // NOTE: sort todos by due date (Ascending / Descending)
      sortTodos: (order) => {
        set({ loading: true });
        const todos = get().dummyTodos;
        if (todos.length < 3) return;
        const newTodos = [...get().dummyTodos].map((item) => {
          const sortedTodos = item.todos.sort((a, b) => {
            if (order === "asc") {
              return getMills(a.dueDate as Date) - getMills(b.dueDate as Date);
            }

            return getMills(b.dueDate as Date) - getMills(a.dueDate as Date);
          });
          return { ...item, todos: sortedTodos };
        });
        set({ todos: newTodos, loading: false });
      },
      filterTodosBySearchString: (searchString: string) => {
        set({ loading: true });
        set({ todoSearchString: searchString });
        const newTodos = [...get().dummyTodos].map((item) => {
          const filterTodos = item.todos.filter((item) =>
            item.text.toLowerCase().includes(searchString.toLowerCase())
          );
          return { ...item, todos: filterTodos };
        });
        set({ todos: newTodos, loading: false });
      },

      // NOTE: delete task by clicking the delete option from the todo action picker component
      deleteTask: async (todo: todo, userId: string) => {
        if (todo.fileUrl.length > 0) {
          for (let i = 0; i < todo.fileUrl.length; i++) {
            const { error } = await supabase.storage
              .from("todofiles")
              .remove([todo.fileUrl[i].path]);
            if (error) {
              return;
            }
          }
        }
        const { error } = await supabase
          .from("Todos")
          .delete()
          .eq("id", todo.id);
        if (!error) {
          toast("Task Deleted");
          get().fetchTodos(userId);
          return false;
        } else {
          return true;
        }
      },

      // NOTE: to perform multiple batch operations
      performMultipleActions: async (
        type: string,
        userId: string,
        status?: string
      ) => {
        const todos = [...get().multipleActionData];
        for (const todo of todos) {
          if (type === "status" && status) {
            const newHistory =
              status !== todo.status
                ? [
                    ...todo.history,
                    {
                      time: Date.now(),
                      actionType: `status updated from ${todo.status} to ${status}`,
                    },
                  ]
                : todo.history;
            await supabase
              .from("Todos")
              .update({
                status: status,
                history: newHistory,
              })
              .eq("id", todo.id);
            get().fetchTodos(userId);
          } else {
            await deleteDocument(todo.id as string);
          }
        }
        toast(`Task ${type === "delete" ? "Deleted" : "Updated"} Successfully`);
        get().fetchTodos(userId);
        set({ multipleActionData: [] });
      },
    }),
    // NOTE: to save the state in local storage
    {
      name: "todos",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        todos: state.todos,
        aiTodoPrompt: state.aiTodoPrompt,
      }),
    }
  )
);
