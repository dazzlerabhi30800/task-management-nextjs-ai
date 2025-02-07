"use client";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/public/store/UserSlice";
import { ClipboardList, LogOut, Search, SquareKanban } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { SelectCategory } from "./SelectCategory";
import { SelectDueDate } from "./SelectDueDate";
import { googleLogout } from "@react-oauth/google";
import { useActionStore } from "@/public/store/ActionSlice";
import { useTodoStore } from "@/public/store/TodoSlice";
import { toast } from "sonner";

const Header = () => {
  const { user, setUser } = useUserStore((state) => state);
  const { setShowTaskDialog } = useActionStore((state) => state);
  const { setTodos, filterTodosBySearchString, setTodoInfoInitial } =
    useTodoStore((state) => state);
  const [searchString, setSearchString] = React.useState<string>("");
  const path = usePathname();
  const router = useRouter();
  const handleLogout = () => {
    googleLogout();
    router.push("/");
    setUser(null);
    setTodos([]);
    setTodoInfoInitial();
    toast.success("You've been logged out!!");
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      filterTodosBySearchString(searchString);
    }, 600);
    return () => clearTimeout(timeout);
  }, [searchString]);

  return (
    <header className="md:py-10 w-full">
      {/* NOTE: First Section */}
      <div className="flex justify-between items-center bg-pink-500 md:bg-transparent p-3 md:p-0 md:px-8">
        <div className="flex flex-col gap-4">
          <Image
            src={"/logo-dark.svg"}
            alt="Task Buddy"
            className="w-24 h-[20px] md:h-auto md:w-[150px]"
            width={150}
            style={{ width: "auto", height: "auto" }}
            priority={true}
            height={20}
          />
          <nav className="hidden md:flex items-center gap-6 text-lg text-gray-600 font-medium pl-1">
            <Link
              className={`${
                path === "/list" && "text-black active"
              } relative flex items-center gap-1`}
              href="/list"
            >
              <ClipboardList size={18} /> List
            </Link>
            <Link
              className={`${
                path === "/list/board" && "text-black active"
              } relative flex items-center gap-1`}
              href="/list/board"
            >
              <SquareKanban size={18} /> Board
            </Link>
          </nav>
        </div>
        {/* NOTE: Second Section */}
        <div className="flex flex-col">
          <div className="flex flex-col gap-2 md:flex-row md:gap-0 items-center">
            <Image
              src={
                (user?.picture as string) ??
                "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_640.png"
              }
              alt={(user?.name as string) ?? "user"}
              width={35}
              height={35}
              className="rounded-[50%] object-cover w-9 h-9 md:h-[35px] md:w-[35px]"
            />
            <p className="text-gray-500 font-semibold ml-3 text-sm hidden md:block">
              {user?.name}
            </p>
          </div>
          <Button
            onClick={() => handleLogout()}
            variant="ghost"
            className="md:flex items-center bg-pink-200/50 mt-1 border border-pink-600/20 text-pink-600 hidden"
          >
            <LogOut /> Logout
          </Button>
        </div>
      </div>

      {/* NOTE: Add Button */}
      <div className="flex justify-between items-center mt-2 mb-3 md:hidden">
        <Button
          onClick={() => handleLogout()}
          variant="ghost"
          className="flex items-center bg-pink-200/50 mt-1 border border-pink-600/20 text-pink-600 ml-3"
        >
          <LogOut /> Logout
        </Button>
        <Button
          variant="default"
          className="mt-3 ml-auto mr-3 bg-fuchsia-800 rounded-3xl flex"
          onClick={() => {
            setTodoInfoInitial();
            setShowTaskDialog();
          }}
        >
          Add Task
        </Button>
      </div>
      {/* NOTE: Second Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between text-gray-500 md:mt-8 px-3 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <span>Filter by :- </span>
          <div className="flex items-center gap-3">
            <SelectCategory type="filter-todos" />
            <SelectDueDate />
          </div>
        </div>
        <div className="flex items-center gap-4 mt-5 md:mt-0">
          <div className="relative">
            <input
              type="text"
              id="task"
              placeholder="Search"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              className="rounded-3xl border border-gray-400 text-gray-500 py-1 px-8 placeholder:text-gray-400 focus:outline-none bg-transparent focus:border-gray-600"
            />
            <label
              htmlFor="task"
              className="absolute search--icon top-1/2 -translate-y-1/2 left-2"
            >
              <Search size={18} />
            </label>
          </div>

          <Button
            variant="default"
            className="hidden md:block bg-fuchsia-800 rounded-3xl h-auto ml-auto"
            onClick={() => {
              setTodoInfoInitial();
              setShowTaskDialog();
            }}
          >
            Add Task
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
