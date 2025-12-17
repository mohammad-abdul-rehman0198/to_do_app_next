"use client";

import { JotaiProvider } from "jotai-controller";

import Todos from "@/components/Todo";
import Header from "@/components/Header";
import Form from "@/components/AddTodoForm";
import HeroSection from "@/components/HeroSection";

const Dashboard = () => {
  return (
    <div className="w-full bg-black h-screen overflow-y-auto text-white flex flex-col items-center">
      <JotaiProvider>
        <Header />
        <HeroSection />
        <Form />
        <Todos />
      </JotaiProvider>
    </div>
  );
};

export default Dashboard;
