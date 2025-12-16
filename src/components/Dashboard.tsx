"use client";

import Form from "@/components/Form";
import Todos from "@/components/Todo";
import Header from "@/components/Header";
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
