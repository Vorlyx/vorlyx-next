"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface NavbarStateContextType {
  isNavbarHidden: boolean;
  setIsNavbarHidden: (hidden: boolean) => void;
}

const NavbarStateContext = createContext<NavbarStateContextType | undefined>(
  undefined
);

export function NavbarStateProvider({ children }: { children: ReactNode }) {
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);

  return (
    <NavbarStateContext.Provider value={{ isNavbarHidden, setIsNavbarHidden }}>
      {children}
    </NavbarStateContext.Provider>
  );
}

export function useNavbarState() {
  const context = useContext(NavbarStateContext);
  if (!context) {
    throw new Error("useNavbarState must be used within NavbarStateProvider");
  }
  return context;
}