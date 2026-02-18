import React, { createContext, ReactNode, useContext, useState } from "react";

interface ChildContextType {
  selectedChildId: number | null;
  setSelectedChildId: (id: number) => void;
}

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export const ChildProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  return (
    <ChildContext.Provider value={{ selectedChildId, setSelectedChildId }}>
      {children}
    </ChildContext.Provider>
  );
};

export const useChildContext = () => {
  const context = useContext(ChildContext);
  if (!context) {
    // Return default values instead of throwing error
    return {
      selectedChildId: null,
      setSelectedChildId: () => {},
    };
  }
  return context;
};
