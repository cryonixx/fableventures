import React, { createContext, ReactNode, useContext, useState } from "react";

// selectedChildId is the Firestore document ref id for the selected child
interface ChildContextType {
  selectedChildId: string | null;
  setSelectedChildId: (id: string | null) => void;
}

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export const ChildProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // selectedChildId is the Firestore document ref id for the selected child
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
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
      setSelectedChildId: (_id: string | null) => {},
    };
  }
  return context;
};
