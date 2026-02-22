import { collection, getDocs, query, where } from "firebase/firestore";
import React, { createContext, useCallback, useContext, useState } from "react";
import { db } from "../firebase";
import { useChildContext } from "./ChildContext";

interface ChildProfileContextType {
  favoriteAnimals: string[];
  refreshFavorites: () => Promise<void>;
}

const ChildProfileContext = createContext<ChildProfileContextType | undefined>(
  undefined,
);

export const ChildProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { selectedChildId } = useChildContext();
  const [favoriteAnimals, setFavoriteAnimals] = useState<string[]>([]);

  const refreshFavorites = useCallback(async () => {
    if (!selectedChildId) return;
    try {
      const favRef = collection(db, "favorite_animals");
      const favQ = query(favRef, where("child_id", "==", selectedChildId));
      const favSnap = await getDocs(favQ);
      const favoriteNames = favSnap.docs.map((doc) => doc.data().animal_id);
      setFavoriteAnimals(favoriteNames);
    } catch {
      setFavoriteAnimals([]);
    }
  }, [selectedChildId]);

  return (
    <ChildProfileContext.Provider value={{ favoriteAnimals, refreshFavorites }}>
      {children}
    </ChildProfileContext.Provider>
  );
};

export function useChildProfile() {
  const ctx = useContext(ChildProfileContext);
  if (!ctx)
    throw new Error("useChildProfile must be used within ChildProfileProvider");
  return ctx;
}
