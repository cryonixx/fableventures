import {
    collectAnimal,
    getChildProgress,
    loadStoryData,
    saveChildProgress,
} from "@/src/database/storyManager";
import { Story } from "@/src/types/story";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useState } from "react";
import {
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from "react-native";

interface StoryPlayerProps {
  childId: number;
  storyId: string;
  onMinigameNeeded?: (minigameId: string) => void;
  onComplete?: () => void;
  onGoBack?: () => void;
}

export default function StoryPlayer({
  childId,
  storyId,
  onMinigameNeeded,
  onComplete,
  onGoBack,
}: StoryPlayerProps) {
  const [story, setStory] = useState<Story | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStory = async () => {
      try {
        const storyData = await loadStoryData();
        setStory(storyData);

        // Load saved progress
        const savedProgress = await getChildProgress(childId, storyId);

        if (savedProgress) {
          // Find the indices for the saved chapter and scene
          const chapterIndex = storyData.sections.findIndex(
            (ch) => ch.id === savedProgress.current_chapter_id,
          );

          if (chapterIndex >= 0) {
            const sceneIndex = storyData.sections[
              chapterIndex
            ].scenes.findIndex(
              (sc) => sc.id === savedProgress.current_scene_id,
            );

            if (sceneIndex >= 0) {
              setCurrentChapterIndex(chapterIndex);
              setCurrentSceneIndex(sceneIndex);
              setCurrentNodeIndex(savedProgress.current_node_index || 0);
              console.log(
                `Resuming story from Chapter ${chapterIndex + 1}, Scene ${sceneIndex + 1}, Node ${savedProgress.current_node_index}`,
              );
            }
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading story:", error);
        setLoading(false);
      }
    };

    loadStory();
  }, [childId, storyId]);

  if (loading || !story) {
    return (
      <View className="flex-1 justify-center items-center bg-amber-50">
        <Text className="text-lg font-semibold">Loading story...</Text>
      </View>
    );
  }

  const currentChapter = story.sections[currentChapterIndex];
  const currentScene = currentChapter.scenes[currentSceneIndex];
  const currentNode = currentScene.nodes[currentNodeIndex];

  const handleNodeContinue = async () => {
    // Calculate next position
    let nextChapterIndex = currentChapterIndex;
    let nextSceneIndex = currentSceneIndex;
    let nextNodeIndex = currentNodeIndex;

    // Check if we need to collect an animal after this node
    if (currentNodeIndex === currentScene.nodes.length - 1) {
      // Last node of the scene
      if (currentScene.animal) {
        try {
          await collectAnimal(
            childId,
            currentScene.animal,
            storyId,
            currentScene.id,
          );
        } catch (error) {
          console.warn(
            "Could not collect animal (likely database issue):",
            error,
          );
          // Continue anyway - don't block story progression
        }
      }

      // Move to next scene
      if (currentSceneIndex < currentChapter.scenes.length - 1) {
        nextSceneIndex = currentSceneIndex + 1;
        nextNodeIndex = 0;
      } else if (currentChapterIndex < story.sections.length - 1) {
        // Move to next chapter
        nextChapterIndex = currentChapterIndex + 1;
        nextSceneIndex = 0;
        nextNodeIndex = 0;
      } else {
        // Story complete
        if (onComplete) onComplete();
        return;
      }
    } else {
      // Move to next node
      nextNodeIndex = currentNodeIndex + 1;
    }

    // Save progress with the next position
    try {
      const nextChapter = story.sections[nextChapterIndex];
      const nextScene = nextChapter.scenes[nextSceneIndex];

      await saveChildProgress(
        childId,
        storyId,
        nextChapter.id,
        nextScene.id,
        nextNodeIndex,
      );
    } catch (error) {
      console.warn("Could not save progress:", error);
    }

    // Update state to show next position
    setCurrentChapterIndex(nextChapterIndex);
    setCurrentSceneIndex(nextSceneIndex);
    setCurrentNodeIndex(nextNodeIndex);
  };

  const handleChoice = async (choiceIndex: number) => {
    // For "illusion of choice", just continue regardless of selection
    await handleNodeContinue();
  };

  const handleMinigame = () => {
    if (currentScene.type === "minigame" && currentScene.minigame_id) {
      if (onMinigameNeeded) {
        onMinigameNeeded(currentScene.minigame_id);
      }
    }
  };

  // Get animal image based on current scene animal
  const getAnimalImage = () => {
    const animalName = currentScene.animal || currentNode.character;
    switch (animalName?.toLowerCase()) {
      case "owl":
        return require("@/assets/images/BookCover.png");
      case "chicken":
        return require("@/assets/images/BookCover.png");
      case "red fox":
      case "fox":
        return require("@/assets/images/BookCover.png");
      case "turtle":
        return require("@/assets/images/BookCover.png");
      default:
        return require("@/assets/images/BookCover.png");
    }
  };

  // Helper function to find the last character who spoke in the current scene
  const getLastDialogueCharacter = (): string | undefined => {
    // Look backwards from current node to find the last dialogue node
    for (let i = currentNodeIndex - 1; i >= 0; i--) {
      const node = currentScene.nodes[i];
      if (node.type === "dialogue" && node.character) {
        return node.character;
      }
    }
    // If no previous dialogue found, use scene animal as fallback
    return currentScene.animal;
  };

  const displayCharacter =
    currentNode.type === "dialogue"
      ? currentNode.character
      : currentNode.type === "choice"
        ? getLastDialogueCharacter()
        : currentScene.animal;

  return (
    <SafeAreaView className="flex-1 bg-amber-100">
      <View className="flex-1 flex-col">
        {/* Story Content */}
        <ScrollView
          className="flex-1 px-4 py-4"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          {/* Animal/Character Image with Forest Background */}
          {displayCharacter && currentNode.type !== "minigame" && (
            <View className="items-center mb-6">
              <View className="relative w-full">
                {/* Forest background container */}
                <View className="bg-gradient-to-b from-green-600 to-green-700 rounded-3xl p-4 items-center overflow-hidden">
                  {/* Decorative trees/foliage */}
                  <View className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-green-500 to-transparent opacity-40" />

                  {/* Animal Image */}
                  <Image
                    source={getAnimalImage()}
                    className="w-48 h-48 rounded-2xl my-4 z-10"
                    resizeMode="cover"
                  />
                </View>
              </View>
            </View>
          )}

          {/* Story Text Content - Narrator and Dialogue */}
          {(currentNode.type === "narrator" ||
            currentNode.type === "dialogue") && (
            <View className="bg-white rounded-2xl p-5 shadow-md mb-4">
              {currentNode.type === "narrator" && (
                <Text className="text-base text-gray-800 leading-relaxed">
                  {currentNode.text}
                </Text>
              )}

              {currentNode.type === "dialogue" && (
                <View>
                  <Text className="text-sm font-bold text-green-600 mb-2">
                    {currentNode.character}
                  </Text>
                  <Text className="text-base text-gray-800 leading-relaxed">
                    {currentNode.text}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Choices Section */}
          {currentNode.type === "choice" && currentNode.options && (
            <View>
              {/* Question prompt */}
              <View className="bg-white rounded-2xl p-4 mb-4 items-center">
                <Text className="text-lg font-bold text-gray-800 mb-1">
                  What will you say?
                </Text>
                <Text className="text-xs text-gray-500 italic">
                  (pick and read one choice)
                </Text>
              </View>

              {/* Choice buttons as large cards */}
              {currentNode.options.map((option, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleChoice(index)}
                  className="bg-green-600 rounded-2xl p-4 mb-3 active:bg-green-700 shadow-md"
                >
                  <Text className="text-white font-bold text-center text-base leading-relaxed">
                    "{option}"
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Minigame Section */}
          {currentNode.type === "minigame" && (
            <View className="bg-white rounded-2xl p-5 items-center justify-center shadow-md">
              <Text className="text-base font-semibold text-gray-800 mb-3 text-center">
                {currentScene.description || "Minigame"}
              </Text>
              <Pressable
                onPress={handleMinigame}
                className="bg-purple-600 rounded-xl px-6 py-3 active:bg-purple-700"
              >
                <Text className="text-white font-bold">Start Minigame</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>

        {/* Continue Button - Only for narrator/dialogue */}
        {currentNode.type !== "choice" && currentNode.type !== "minigame" && (
          <View className="px-4 pb-3">
            <Pressable
              onPress={handleNodeContinue}
              className="bg-green-700 rounded-xl p-4 active:bg-green-800 shadow-md"
            >
              <Text className="text-white font-bold text-center text-lg">
                Continue
              </Text>
            </Pressable>
          </View>
        )}

        {/* Persistent Footer with Controls */}
        <View className="bg-green-700 px-4 py-3 flex-row items-center justify-between rounded-t-3xl">
          {/* Go Back Button */}
          {onGoBack && (
            <Pressable
              onPress={onGoBack}
              className="bg-yellow-100 rounded-lg px-4 py-2 active:bg-yellow-200 flex-row items-center gap-1"
            >
              <Text className="text-green-700 font-bold text-base">
                Go Back
              </Text>
            </Pressable>
          )}

          {/* Spacer */}
          <View className="flex-1" />

          {/* Sound Button */}
          <Pressable
            onPress={() => console.log("Sound button pressed")}
            className="p-2 active:opacity-70"
          >
            <MaterialIcons name="volume-up" size={28} color="white" />
          </Pressable>

          {/* Mute Button */}
          <Pressable
            onPress={() => console.log("Mute button pressed")}
            className="p-2 ml-2 active:opacity-70"
          >
            <MaterialIcons name="volume-mute" size={28} color="white" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
