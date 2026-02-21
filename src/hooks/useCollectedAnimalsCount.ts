import { useEffect, useState } from "react";
import { useChildContext } from "../context/ChildContext";
import { getCollectedAnimals } from "../database/storyManager";

export const useCollectedAnimalsCount = () => {
  const [count, setCount] = useState(0);
  const { selectedChildId } = useChildContext();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        // Use selected child ID from context, fallback to test child
        const childId = selectedChildId;
        if (!childId) {
          setCount(0);
          return;
        }

        const collected = await getCollectedAnimals(childId);
        setCount(collected.length);
      } catch (error) {
        console.error("Error fetching collected animals count:", error);
        setCount(0);
      }
    };

    fetchCount();
  }, [selectedChildId]);

  return count;
};
