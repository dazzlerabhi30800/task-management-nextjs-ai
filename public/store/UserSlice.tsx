import { supabase } from "@/config/SupabaseConfig";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface userStore {
  user: user | null;
  setUser: (user: user | null) => void;
  saveUserInDatabase: (user: user) => void;
}

export const useUserStore = create<userStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => {
        set({ user: user });
      },
      saveUserInDatabase: async (user: user) => {
        //NOTE: check if user is already in the database
        const { data } = await supabase
          .from("Users")
          .select("*")
          .eq("email", user?.email)
          .limit(1);
        // NOTE: if not present in database, save in database
        if (data && data?.length < 1) {
          const { data, error } = await supabase
            .from("Users")
            .upsert({
              name: user.name,
              email: user.email,
              picture: user.picture,
            })
            .select()
            .limit(1);
          if (!data && error) {
            console.log(error);
          }
          set({ user: data && data[0] });
          return;
        }
        set({ user: data && data[0] });
      },
    }),
    {
      name: "userInfo",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
