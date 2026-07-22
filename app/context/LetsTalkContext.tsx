"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface LetsTalkContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const LetsTalkContext = createContext<LetsTalkContextType | undefined>(
  undefined
);

export function LetsTalkProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <LetsTalkContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </LetsTalkContext.Provider>
  );
}

export function useLetsTalk() {
  const context = useContext(LetsTalkContext);
  if (!context) {
    throw new Error("useLetsTalk must be used within LetsTalkProvider");
  }
  return context;
}