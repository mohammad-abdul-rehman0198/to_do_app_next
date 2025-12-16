"use client";

import Todos from "@/components/Todo";
import Header from "@/components/Header";
import Form from "@/components/AddTodoForm";
import HeroSection from "@/components/HeroSection";

const Dashboard = () => {
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
