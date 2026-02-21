import {
  collectAnimal,
  getChildProgress,
  loadStoryData,
  saveChildProgress,
} from "@/src/database/storyManager";
import { useImage } from "@/src/hooks/useImage";
import { Story } from "@/src/types/story";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

interface StoryPlayerProps {
  childId: string;
  storyId: string;
  onMinigameNeeded?: (minigameId: string) => void;
  chapterGroupStartId?: string;
  chapterGroupEndId?: string;
  onChapterComplete?: (chapterId: string, chapterTitle: string) => void;
  onComplete?: () => void;
  onGoBack?: () => void;
}

export default function StoryPlayer({
  childId,
  storyId,
  onMinigameNeeded,
  chapterGroupStartId,
  chapterGroupEndId,
  onChapterComplete,
  onComplete,
  onGoBack,
}: StoryPlayerProps) {
  const [story, setStory] = useState<Story | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [chapterGroupEndIndex, setChapterGroupEndIndex] = useState(0);

  useEffect(() => {
    const loadStory = async () => {
      try {
        const storyData = await loadStoryData();
        setStory(storyData);

        const defaultStartId = chapterGroupStartId || storyData.sections[0].id;
        const defaultEndId =
          chapterGroupEndId ||
          storyData.sections[storyData.sections.length - 1].id;

        const startIndex = Math.max(
          0,
          storyData.sections.findIndex((ch) => ch.id === defaultStartId),
        );
        const endIndex = Math.max(
          startIndex,
          storyData.sections.findIndex((ch) => ch.id === defaultEndId),
        );

        setChapterGroupEndIndex(endIndex);

        // Load saved progress
        const savedProgress = await getChildProgress(childId, storyId);

        if (savedProgress) {
          setCompletedChapters(savedProgress.completed_chapters || []);

          // Find the indices for the saved chapter and scene
          const chapterIndex = storyData.sections.findIndex(
            (ch) => ch.id === savedProgress.current_chapter_id,
          );

          const isInGroup =
            chapterIndex >= startIndex && chapterIndex <= endIndex;

          if (chapterIndex >= 0 && isInGroup) {
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
          } else {
            setCurrentChapterIndex(startIndex);
            setCurrentSceneIndex(0);
            setCurrentNodeIndex(0);
            console.log(
              `Starting story from Chapter ${startIndex + 1}, Scene 1, Node 0`,
            );
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading story:", error);
        setLoading(false);
      }
    };

    loadStory();
  }, [childId, storyId, chapterGroupStartId, chapterGroupEndId]);

  // Prefer current node's character for image if present, else fallback to scene animal
  const currentNodeCharacter =
    story?.sections[currentChapterIndex]?.scenes[currentSceneIndex]?.nodes[
      currentNodeIndex
    ]?.character;
  const sceneAnimal =
    story?.sections[currentChapterIndex]?.scenes[currentSceneIndex]?.animal;
  const characterImageName = currentNodeCharacter || sceneAnimal;
  const characterImage = useImage(characterImageName);

  if (loading || !story) {
    return (
      <View className="flex-1 justify-center items-center bg-amber-50">
        <Text
          className="text-lg"
          style={{ fontFamily: "LilitaOne_400Regular" }}
        >
          Loading story...
        </Text>
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
      } else if (currentChapterIndex < chapterGroupEndIndex) {
        // Move to next chapter within the selected group
        nextChapterIndex = currentChapterIndex + 1;
        nextSceneIndex = 0;
        nextNodeIndex = 0;
      } else {
        // Selected chapter group complete
        const updatedCompletedChapters = completedChapters.includes(
          currentChapter.id,
        )
          ? completedChapters
          : [...completedChapters, currentChapter.id];

        setCompletedChapters(updatedCompletedChapters);

        try {
          await saveChildProgress(
            childId,
            storyId,
            currentChapter.id,
            currentScene.id,
            currentNodeIndex,
            updatedCompletedChapters,
          );
        } catch (error) {
          console.warn("Could not save progress:", error);
        }

        if (onChapterComplete) {
          onChapterComplete(currentChapter.id, currentChapter.title);
        } else if (onComplete) {
          onComplete();
        }
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
        completedChapters,
      );
    } catch (error) {
      console.warn("Could not save progress:", error);
    }

    // Update state to show next position
    setCurrentChapterIndex(nextChapterIndex);
    setCurrentSceneIndex(nextSceneIndex);
    setCurrentNodeIndex(nextNodeIndex);
  };

  const handleChoice = async () => {
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
      <ImageBackground
        source={require("@/assets/images/story/forestbackground.png")}
        className="flex-1"
        resizeMode="cover"
      >
        <View className="flex-1 flex-col">
          {/* Story Content */}
          <ScrollView
            className="flex-1 px-4 py-4"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
            }}
          >
            {/* Animal/Character Image */}
            {displayCharacter && currentNode.type !== "minigame" && (
              <View className="items-center mb-6">
                <Image
                  source={characterImage}
                  className="w-80 h-80"
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Story Text Content - Narrator and Dialogue */}
            {currentNode.type === "narrator" && (
              <View className="bg-white rounded-2xl p-6 shadow-md mb-4 ">
                <Text
                  className="text-2xl text-red-950 leading-relaxed"
                  style={{ fontFamily: "Pangolin_400Regular" }}
                >
                  {currentNode.text}
                </Text>
              </View>
            )}

            {currentNode.type === "dialogue" && (
              <View className="relative items-center">
                <ImageBackground
                  source={require("@/assets/images/ui/dialoguebox.png")}
                  resizeMode="stretch"
                  style={{ width: 340, height: 220 }}
                >
                  <View className="h-auto m-8 pt-8">
                    <Text
                      className="text-2xl text-red-950 leading-relaxed"
                      style={{ fontFamily: "Pangolin_400Regular" }}
                    >
                      {currentNode.text}
                    </Text>
                  </View>
                </ImageBackground>
                <View
                  className="absolute bg-green-700 px-4 py-2 rounded-xl"
                  style={{ top: 5, left: 20 }}
                >
                  <Text
                    className="text-white text-3xl"
                    style={{ fontFamily: "LilitaOne_400Regular" }}
                  >
                    {currentNode.character}
                  </Text>
                </View>
              </View>
            )}

            {/* Choices Section */}
            {currentNode.type === "choice" && currentNode.options && (
              <View>
                {/* Question prompt */}
                <View className="bg-white rounded-2xl p-4 mb-4 items-center">
                  <Text
                    className="text-2xl text-red-950 mb-1"
                    style={{ fontFamily: "LilitaOne_400Regular" }}
                  >
                    What will you say?
                  </Text>
                  <Text
                    className="text-lg text-neutral-500"
                    style={{ fontFamily: "Pangolin_400Regular" }}
                  >
                    (pick and read one choice)
                  </Text>
                </View>

                {/* Choice buttons as large cards */}
                {currentNode.options.map((option, index) => (
                  <Pressable
                    key={index}
                    onPress={handleChoice}
                    className="bg-green-600 rounded-2xl p-4 mb-3 active:bg-green-700 shadow-md"
                  >
                    <Text
                      className="text-white text-center text-xl leading-relaxed"
                      style={{ fontFamily: "LilitaOne_400Regular" }}
                    >
                      &quot;{option}&quot;
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Minigame Section */}
            {currentNode.type === "minigame" && (
              <View className="bg-white rounded-2xl p-5 items-center justify-center shadow-md">
                <Text
                  className="text-base text-red-950 mb-3 text-center"
                  style={{ fontFamily: "Pangolin_400Regular" }}
                >
                  {currentScene.description || "Minigame"}
                </Text>
                <Pressable
                  onPress={handleMinigame}
                  className="bg-purple-600 rounded-xl px-6 py-3 active:bg-purple-700"
                >
                  <Text
                    className="text-white"
                    style={{ fontFamily: "LilitaOne_400Regular" }}
                  >
                    Start Minigame
                  </Text>
                </Pressable>
              </View>
            )}
          </ScrollView>

          {/* Continue Button - Only for narrator/dialogue */}
          {currentNode.type !== "choice" && currentNode.type !== "minigame" && (
            <View className="px-4 pb-3 flex-row justify-between gap-3">
              <Pressable
                onPress={() => setCurrentNodeIndex((i) => Math.max(0, i - 1))}
                className="flex-1 bg-green-200 rounded-xl p-4 active:bg-green-300 shadow-md items-center"
              >
                <Text
                  className="text-green-900 text-center text-lg"
                  style={{ fontFamily: "LilitaOne_400Regular" }}
                >
                  Prev
                </Text>
              </Pressable>
              <Pressable
                onPress={handleNodeContinue}
                className="flex-1 bg-green-700 rounded-xl p-4 active:bg-green-800 shadow-md items-center"
              >
                <Text
                  className="text-white text-center text-lg"
                  style={{ fontFamily: "LilitaOne_400Regular" }}
                >
                  Next
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
                <Text
                  className="text-green-700 text-base"
                  style={{ fontFamily: "LilitaOne_400Regular" }}
                >
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
              <MaterialIcons name="volume-up" size={32} color="white" />
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
