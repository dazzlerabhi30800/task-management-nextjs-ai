import { todoItem, todos } from "./public/store/TodoSlice";

type user = {
  id?: string | number;
  created_at?: string;
  name: string;
  email: string;
  picture: string;
};

type category = "to-do" | "in-progress" | "completed";
type categoryType = Array<category>;

type fileInfo = {
  fileType: string;
  fileLink: string;
  path: string;
};

type fetch = {
  formattedTodos: todoItem[];
  todoPrompt: string | undefined;
};
