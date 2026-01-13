import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import MiniGames from "../../components/favorites/MiniGames";
import Puzzles from "../../components/favorites/Puzzles";
import Stories from "../../components/favorites/Stories";

type NaviProps = {
  navigateTo: (screen: string) => void;
};

type TabType = "puzzles" | "minigames" | "stories";

export default function Favorites({ navigateTo }: NaviProps) {
  const [activeTab, setActiveTab] = useState<TabType>("puzzles");

  const renderContent = () => {
    switch (activeTab) {
      case "puzzles":
        return <Puzzles navigateTo={navigateTo} />;
      case "minigames":
        return <MiniGames navigateTo={navigateTo} />;
      case "stories":
        return <Stories navigateTo={navigateTo} />;
    }
  };

  return (
    <View className="flex-1 bg-amber-50">
      <View className="h-1/4 w-full rounded-b-xl bg-green-400 p-5 drop-shadow-lg">
        <Text className="mt-8 text-2xl text-white font-bold">
          Fable Friends
        </Text>
        <Text className="text-md text-white">
          Learn more about your animal friends!
        </Text>

        <View className="mt-3 h-2/5 w-full rounded-lg bg-white p-4 drop-shadow-md">
          <View className="flex-row justify-between gap-2">
            <Pressable
              className="flex-1 rounded-lg p-2 bg-neutral-100"
              onPress={() => setActiveTab("puzzles")}
            >
              <Text className="text-md font-bold text-center text-neutral-500">
                Puzzles
              </Text>
            </Pressable>

            <Pressable
              className="flex-1 rounded-lg p-2 bg-neutral-100"
              onPress={() => setActiveTab("stories")}
            >
              <Text className="text-md font-bold text-center text-neutral-500">
                Short Stories
              </Text>
            </Pressable>

            <Pressable
              className="flex-1 rounded-lg p-2 bg-neutral-100"
              onPress={() => setActiveTab("minigames")}
            >
              <Text className="text-md font-bold text-center text-neutral-500">
                Mini-games
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 w-full">
        <View className="p-4">{renderContent()}</View>
      </ScrollView>
    </View>
  );
}
