import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { ChildHeader } from "../../../components/child_components/ChildHeader";
import RewardCard from "../../../components/child_components/RewardCard";
import { useChildContext } from "../../../context/ChildContext";
import {
  Achievement,
  getAllAchievements,
  getChildAchievements,
} from "../../../database/achievementsManager";
import { getTestChildId } from "../../../database/testData";
import { useCollectedAnimalsCount } from "../../../hooks/useCollectedAnimalsCount";

export default function Achievements() {
  const collectedCount = useCollectedAnimalsCount();
  const { selectedChildId } = useChildContext();
  const [earnedAchievements, setEarnedAchievements] = useState<Achievement[]>(
    [],
  );
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAchievements = async () => {
    try {
      const childId = selectedChildId || (await getTestChildId());

      // Get all achievements
      const all = await getAllAchievements();
      setAllAchievements(all);

      // Get earned achievements
      const earned = await getChildAchievements(childId);
      setEarnedAchievements(earned);

      setLoading(false);
    } catch (error) {
      console.error("Error loading achievements:", error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAchievements();
    }, [selectedChildId]),
  );

  if (loading) {
    return (
      <View className="flex-1 bg-amber-50 justify-center items-center">
        <Text>Loading achievements...</Text>
      </View>
    );
  }

  return (
    <View className={["flex-1", "bg-amber-50"].join(" ")}>
      <ChildHeader currentprogress={collectedCount} />
      <ScrollView
        className={["flex-1", "w-full", "overflow-hidden", "p-2"].join(" ")}
      >
        <View className="p-2">
          <Text className="text-xl font-bold text-green-700 mb-2">
            Your Achievements ({earnedAchievements.length}/
            {allAchievements.length})
          </Text>
        </View>

        {allAchievements.length === 0 ? (
          <View className="flex-1 justify-center items-center p-8">
            <Text className="text-lg text-gray-600 text-center">
              No achievements available
            </Text>
          </View>
        ) : (
          allAchievements.map((achievement) => {
            const isEarned = earnedAchievements.some(
              (earned) => earned.achievement_id === achievement.achievement_id,
            );
            return (
              <RewardCard
                key={achievement.achievement_id}
                name={achievement.title}
                description={achievement.description}
                animalName={achievement.criteria}
                isLocked={!isEarned}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
