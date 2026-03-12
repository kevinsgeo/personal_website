"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const IntroSeenContext = createContext<{
  introSeen: boolean;
  setIntroSeen: (value: boolean) => void;
}>({ introSeen: false, setIntroSeen: () => {} });

export function IntroSeenProvider({ children }: { children: ReactNode }) {
  const [introSeen, setIntroSeen] = useState(false);
  return (
    <IntroSeenContext.Provider value={{ introSeen, setIntroSeen }}>
      {children}
    </IntroSeenContext.Provider>
  );
}

export function useIntroSeen() {
  return useContext(IntroSeenContext);
}
