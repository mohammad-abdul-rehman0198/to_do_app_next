"use client";

import { JotaiProvider as JotaiProviderComponent } from "jotai-controller";

const JotaiProvider = ({ children }: { children: React.ReactNode }) => {
  return <JotaiProviderComponent>{children}</JotaiProviderComponent>;
};

export default JotaiProvider;