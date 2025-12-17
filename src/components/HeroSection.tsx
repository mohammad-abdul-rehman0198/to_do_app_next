import { useEffect, useState } from "react";

import type { Todo } from "@/utils/interfaces/Todo";
import { todoController } from "@/state/controller/todo";


const HeroSection = () => {
  const { todos } = todoController.useState(["todos"]);

  const [todosSize, setTodosSize] = useState<number>(0);
  const [completedSize, setCompletedSize] = useState<number>(0);

  useEffect(() => {
    const fetchTodosSize = () => {
      const completed = todos?.filter((todo: Todo) => todo.status === true);

      setTodosSize(todos?.length || 0);
      setCompletedSize(completed?.length || 0);
    };

    fetchTodosSize();

  }, [todos]);

  return (
    <section className="w-[70%] max-[510px]:w-[90%] flex justify-around items-center border border-[#c2b39a] rounded-[11px] gap-3 p-3 max-w-[455px]">
      <div className="flex flex-col items-start justify-center">
        <div className="text-[2rem]">Task Done</div>
        <div className="text-[1.5rem]">Keep it up</div>
      </div>

      <div className="bg-[#88ab33] w-[150px] h-[150px] rounded-full text-[48px] flex items-center justify-center">
        {completedSize}/{todosSize}
      </div>
    </section>
  );
};

export default HeroSection;
