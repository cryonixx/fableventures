import storyJson from "@/assets/script/fable_friends_script.json";
import { useCallback } from "react";

export const useProfileHelpers = () => {
  const getProfileThumbnail = useCallback((name?: string) => {
    switch (name?.toLowerCase()) {
      case "owl":
        return require("@/assets/images/achievements/owl.png");
      case "chicken":
        return require("@/assets/images/achievements/chicken.png");
      case "red fox":
      case "fox":
        return require("@/assets/images/achievements/fox.png");
      case "turtle":
        return require("@/assets/images/achievements/turtle.png");
      case "little red":
        return require("@/assets/images/story/littlered.png");
    }
  }, []);

  const formatLabel = useCallback(
    (value: string) =>
      value
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
    [],
  );

  const getStoryTitleFromId = useCallback(
    (storyId: string): string => {
      const normalizedStoryId = storyId
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .trim();

      // If the story id is 'fablefriends', use the title from the story JSON
      if (normalizedStoryId === "fablefriends") {
        // fallback if title missing
        return storyJson && storyJson.title ? storyJson.title : "Fable Friends";
      }

      return formatLabel(storyId);
    },
    [formatLabel],
  );

  const getReadingLevelFromAge = useCallback((age: number | null): string => {
    if (age === null || Number.isNaN(age)) return "Not set";
    if (age <= 5) return "Pre-Reader";
    if (age <= 8) return "Early Reader";
    if (age <= 12) return "Growing Reader";
    return "Independent Reader";
  }, []);

  const isStoryCompleteCriteria = useCallback((criteria?: string) => {
    const normalizedCriteria = criteria
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .trim();
    return normalizedCriteria === "storycompletefablefriends";
  }, []);

  return {
    getProfileThumbnail,
    formatLabel,
    getStoryTitleFromId,
    getReadingLevelFromAge,
    isStoryCompleteCriteria,
  };
};
