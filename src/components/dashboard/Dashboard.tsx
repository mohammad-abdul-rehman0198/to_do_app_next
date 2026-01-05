"use client";

import TodosList from "@/components/dashboard/TodosList";
import AddTodoForm from "@/components/dashboard/AddTodoForm";
import HeroSection from "@/components/dashboard/HeroSection";

const Dashboard = () => {
  return (
    <div className="w-full bg-black h-screen overflow-y-auto text-white flex flex-col items-center">
      <HeroSection />
      <AddTodoForm />
      <TodosList />
    </div>
  );
};

export default Dashboard;
