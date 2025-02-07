import { useTodoStore } from "@/public/store/TodoSlice";
import { DropResult } from "@hello-pangea/dnd";
import { updateTaskPosition, updateTaskStatus } from "@/lib/SupabaseFunc";

const DragDropFunc = () => {
  const { todos, setTodosWithDummy } = useTodoStore((state) => state);

  // NOTE: to check
  const handleDropResult = async (e: DropResult) => {
    const { source, destination, draggableId } = e;

    // NOTE: if the user dropping the task in same list
    if (source.droppableId === destination?.droppableId) {
      if (source.index === destination.index) return;
      const modTodos = [...todos].map((item) => {
        if (item.id === destination.droppableId) {
          const itemTodos = [...item.todos];
          // INFO: remove the item from its initial position and insert it to target position i.e. dropped position
          const removedItem = itemTodos.splice(source.index, 1)[0];
          removedItem.history = [
            ...removedItem.history,
            {
              actionType: `Position changed from ${source.index + 1} to ${destination.index + 1} `,
              time: Date.now(),
            },
          ];
          itemTodos.splice(destination.index, 0, removedItem);
          return { ...item, todos: itemTodos };
        } else {
          return item;
        }
      });
      setTodosWithDummy(modTodos);
      const onlyTodos = modTodos.filter(
        (item) => item.id === destination.droppableId,
      )[0].todos;
      for (let i = 0; i < onlyTodos.length; i++) {
        await updateTaskPosition(onlyTodos[i].id as string, i + 1);
      }
      return;
    }
    const searchTodo = [...todos]
      .find((item) => item.id === source.droppableId)
      ?.todos.find((todo) => todo.id === draggableId);
    if (!searchTodo) return;
    const modTodos = [...todos].map((item) => {
      if (item.id === source.droppableId) {
        return {
          ...item,
          todos: item.todos.filter((todo) => todo.id !== draggableId),
        };
      }
      if (item.id === destination?.droppableId) {
        const modTodos = [...item.todos];
        const copySearchTodo = { ...searchTodo };
        copySearchTodo.history = [
          ...copySearchTodo.history,
          {
            actionType: `status changed from ${source.droppableId} to ${destination.droppableId}`,
            time: Date.now(),
          },
        ];
        copySearchTodo.status = destination.droppableId;
        modTodos.splice(destination.index, 0, copySearchTodo);
        return {
          ...item,
          todos: modTodos,
        };
      } else {
        return item;
      }
    });
    setTodosWithDummy(modTodos);
    await updateTaskStatus(
      searchTodo,
      "status",
      destination?.droppableId as string,
    );
  };
  return { handleDropResult };
};

export default DragDropFunc;
