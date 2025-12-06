"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface AccordionContextType {
  activeId: string | null;
  toggle: (id: string) => void;
  open: (id: string) => void;
  close: (id: string) => void;
  isOpen: (id: string) => boolean;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

interface AccordionProviderProps {
  children: ReactNode;
  mode?: "single" | "multiple";
}

export function AccordionProvider({ children, mode = "single" }: AccordionProviderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const toggle = useCallback(
    (id: string) => {
      if (mode === "single") {
        setActiveId((prev) => (prev === id ? null : id));
      } else {
        // Multiple mode: would require Set instead, implement if needed
        setActiveId((prev) => (prev === id ? null : id));
      }
    },
    [mode],
  );

  const open = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const close = useCallback(() => {
    setActiveId(null);
  }, []);

  const isOpen = useCallback((id: string) => {
    return activeId === id;
  }, [activeId]);

  return (
    <AccordionContext.Provider value={{ activeId, toggle, open, close, isOpen }}>
      {children}
    </AccordionContext.Provider>
  );
}

export function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("useAccordion must be used within AccordionProvider");
  }
  return context;
}
