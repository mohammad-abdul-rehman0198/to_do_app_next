"use client";

import { useState } from "react";

import Form from "@/components/Form";
import Todos from "@/components/Todo";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { TodoContext } from "@/context/TodoContext";
import type { Todo } from "@/utils/interfaces/Todo";

const Dashboard = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  return (
    <TodoContext.Provider value={{ todos, setTodos }}>
      <div className="w-full bg-black h-screen overflow-y-auto text-white flex flex-col items-center">
        <Header />
        <HeroSection />
        <Form />
        <Todos />
      </div>
    </TodoContext.Provider>
  );
};

export default Dashboard;
