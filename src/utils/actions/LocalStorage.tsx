import { Todo } from "@/utils/interfaces/Todo";


const getFromLocalStorage = (key: string) => {
  try {
    const stored = localStorage.getItem(key) || "[]";
    return stored;
  } catch (error) {
    console.error(error);
  }
};


const setToLocalStorage = (key: string, todos: Todo[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(todos));
  } catch (error) {
    console.error(error);
  }
};

export { getFromLocalStorage, setToLocalStorage };