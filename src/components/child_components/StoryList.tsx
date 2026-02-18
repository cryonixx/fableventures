import StoryPlayer from "@/src/components/child_components/StoryPlayer";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

interface StoryListProps {
  childId: number;
}

export default function StoryList({ childId }: StoryListProps) {
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  const stories = [
    {
      id: "fable-friends",
      title: "Fable Friends",
      description: "Join Little Red on an adventure to help her grandmother...",
      chapters: 3,
    },
  ];

  const handleStartStory = (storyId: string) => {
    setSelectedStory(storyId);
    setShowPlayer(true);
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
    setSelectedStory(null);
  };

  return (
    <View className="flex-1 bg-amber-50">
      <ScrollView>
        <View className="p-4">
          <Text className="text-3xl font-bold text-green-700 mb-6">
            Story Library
          </Text>

          {stories.map((story) => (
            <Pressable
              key={story.id}
              onPress={() => handleStartStory(story.id)}
              className="bg-white rounded-lg p-4 mb-4 shadow"
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-xl font-bold text-gray-800">
                    {story.title}
                  </Text>
                  <Text className="text-base text-gray-600 mt-2">
                    {story.description}
                  </Text>
                  <Text className="text-sm text-gray-500 mt-2">
                    {story.chapters} chapters
                  </Text>
                </View>
              </View>
              <Pressable className="mt-3 bg-green-600 rounded-lg py-2 px-4 self-start">
                <Text className="text-white font-semibold">Read Story</Text>
              </Pressable>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Story Player Modal */}
      <Modal visible={showPlayer} animationType="slide">
        <View className="flex-1">
          {selectedStory && (
            <>
              <Pressable
                onPress={handleClosePlayer}
                className="bg-red-600 px-4 py-3"
              >
                <Text className="text-white font-bold text-center">
                  Exit Story
                </Text>
              </Pressable>
              <StoryPlayer
                childId={childId}
                storyId={selectedStory}
                onComplete={handleClosePlayer}
              />
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}
