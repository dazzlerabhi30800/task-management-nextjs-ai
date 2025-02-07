import { todo } from "@/public/store/TodoSlice";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";
import Compressor from "compressorjs";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkNullObject = (todo: todo) => {
  const emptyLength = Object.values(todo).filter((obj) => obj === "").length;
  const nullDateValue = todo.dueDate;
  return emptyLength > 0 ? true : nullDateValue === undefined ? true : false;
};

export const formatDate = (date: string | Date | void) => {
  if (!date) return;
  const nowDate = new Date(Date.now()).getTime();
  const dueDate = new Date(date).getTime();
  const passedDate = new Date(date);

  // return moment(date).fromNow();
  return dueDate - nowDate > 0
    ? moment(passedDate).startOf("day").fromNow()
    : "Dued " + moment(passedDate).startOf("day").fromNow();
};

export const formatTime = (date: string | Date | void) => {
  if (!date) return;
  return moment(date).calendar();
};

export const firstCharCapital = (str: string) => {
  return str.charAt(0).toUpperCase() + str.substring(1);
};

export const getMills = (date: Date | string | void) => {
  if (!date) return 0;
  const mills = new Date(date).getTime();
  return Number(mills);
};

export const checkDueTime = (date: Date | string | void) => {
  if (!date) return;
  const nowDate = new Date(Date.now()).getTime();
  const dueDate = new Date(date).getTime();
  return dueDate - nowDate > 0;
};

export async function compressFile(file: File, width: number) {
  return await new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.6,
      maxWidth: width ? width : 500,
      success: (result) => {
        resolve(result);
      },
      error(err) {
        toast.error(err.message);
        reject(err);
      },
    });
  });
}

export const checkFilterDate = (
  todoDate: Date | string,
  filterDate: Date | string
) => {
  if (!todoDate || !filterDate) return;
  const date1 = new Date(todoDate);
  const date1Obj = { date: date1.getDate(), month: date1.getMonth() };

  const date2 = new Date(filterDate);
  const date2Obj = { date: date2.getDate(), month: date2.getMonth() };

  return date1Obj.date === date2Obj.date && date1Obj.month === date2Obj.month;
};
