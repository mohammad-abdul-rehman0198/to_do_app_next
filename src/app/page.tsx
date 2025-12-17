"use client";
import { JotaiProvider } from "jotai-controller";

import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <JotaiProvider>
      <Dashboard />
    </JotaiProvider>
  );
}
