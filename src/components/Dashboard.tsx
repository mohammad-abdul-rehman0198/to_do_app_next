"use client";

import { useEffect } from "react";

import Todos from "@/components/Todo";
import Header from "@/components/Header";
import Form from "@/components/AddTodoForm";
import { Todo } from "@/utils/interfaces/Todo";
import { User } from "@/utils/interfaces/User";
import HeroSection from "@/components/HeroSection";
import { todoController } from "@/state/controller/todo";
import { userController } from "@/state/controller/user";
interface DashboardProps {
  todos: Todo[];
  user: User | null;
}

const Dashboard = ({ todos, user }: DashboardProps) => {
  useEffect(() => {
    todoController.setTodos(todos);
    userController.setUser(user as User);
  }, [todos, user]);

  return (
    <div className="w-full bg-black h-screen overflow-y-auto text-white flex flex-col items-center">
      <Header />
      <HeroSection />
      <Form />
      <Todos />
    </div>
  );
};

export default Dashboard;
