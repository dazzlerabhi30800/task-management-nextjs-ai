import { create } from "zustand";

interface userStore {
  showAddTaskBtn: boolean;
  showTaskDialog: boolean;
  showComp: boolean;
  setShowComp: (value: boolean) => void;
  setShowAddTaskBtn: () => void;
  setShowTaskDialog: () => void;
}

export const useActionStore = create<userStore>((set, get) => ({
  // NOTE: to show task add component in the todo list, but I've decided to not to use it, that's why it will not work.
  showAddTaskBtn: false,
  // NOTE: this is to show task dialog component
  showTaskDialog: false,
  // NOTE: this is to show the activity log for task on smaller devices
  showComp: window.innerWidth >= 768 ? true : false,
  setShowComp: (value) => set({ showComp: value }),
  setShowAddTaskBtn: () => {
    set({ showAddTaskBtn: !get().showAddTaskBtn });
  },
  setShowTaskDialog: () => {
    set({ showTaskDialog: !get().showTaskDialog });
  },
}));
