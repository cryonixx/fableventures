import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useChildContext } from "../context/ChildContext";
import { getCollectedAnimals } from "../database/storyManager";
import { getTestChildId } from "../database/testData";

export const useCollectedAnimalsCount = () => {
  const [count, setCount] = useState(0);
  const { selectedChildId } = useChildContext();

  useFocusEffect(
    useCallback(() => {
      const fetchCount = async () => {
        try {
          // Use selected child ID from context, fallback to test child
          const childId = selectedChildId || (await getTestChildId());
          const collected = await getCollectedAnimals(childId);
          setCount(collected.length);
        } catch (error) {
          console.error("Error fetching collected animals count:", error);
          setCount(0);
        }
      };

      fetchCount();
    }, [selectedChildId]),
  );

  return count;
};
