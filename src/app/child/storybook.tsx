import StoryPlayer from "@/src/components/child_components/StoryPlayer";
import { useChildContext } from "@/src/context/ChildContext";
import { awardAchievementByCriteria } from "@/src/database/achievementsManager";
import {
  getChildProgress,
  loadStoryData,
  saveChildProgress,
} from "@/src/database/storyManager";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function Storybook() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const chapterIdParam =
    typeof params.chapterId === "string" ? params.chapterId : null;
  const [childId, setChildId] = useState<string | null>(null);
  const [hasProgress, setHasProgress] = useState<boolean>(false);
  const [showStory, setShowStory] = useState<boolean>(false);
  const [checkingProgress, setCheckingProgress] = useState(true);
  const [chapterGroupStartId, setChapterGroupStartId] = useState<string | null>(
    null,
  );
  const [chapterGroupEndId, setChapterGroupEndId] = useState<string | null>(
    null,
  );
  const [showChapterCompletePopup, setShowChapterCompletePopup] =
    useState(false);
  const [showStoryCompletePopup, setShowStoryCompletePopup] = useState(false);
  const [completedChapterTitle, setCompletedChapterTitle] = useState("");
  const { selectedChildId } = useChildContext();

  const getChapterGroup = (chapterId: string | null) => {
    if (chapterId === "chapter_2") {
      return { startId: "chapter_2", endId: "chapter_2" };
    }
    if (chapterId === "chapter_3") {
      return { startId: "chapter_3", endId: "chapter_3" };
    }

    // chapter_1 includes the prologue
    return { startId: "prologue", endId: "chapter_1" };
  };

  const setChapterStart = async (
    childIdValue: string,
    startId: string,
    completedChapters: string[],
  ) => {
    const storyData = await loadStoryData();
    const startChapter = storyData.sections.find((ch) => ch.id === startId);
    const firstScene = startChapter?.scenes[0];

    if (!startChapter || !firstScene) return;

    await saveChildProgress(
      childIdValue,
      "fable-friends",
      startChapter.id,
      firstScene.id,
      0,
      completedChapters,
    );
  };

  useEffect(() => {
    const loadChildId = async () => {
      // Use selected child ID from context only
      if (!selectedChildId) {
        setChildId(null);
        setCheckingProgress(false);
        return;
      }
      setChildId(selectedChildId);

      // Check if there's saved progress
      const progress = await getChildProgress(selectedChildId, "fable-friends");
      const resolvedChapterId =
        chapterIdParam || progress?.current_chapter_id || "chapter_1";
      const group = getChapterGroup(resolvedChapterId);
      setChapterGroupStartId(group.startId);
      setChapterGroupEndId(group.endId);

      const hasGroupProgress =
        !!progress &&
        !!progress.current_chapter_id &&
        (progress.current_chapter_id === group.startId ||
          progress.current_chapter_id === group.endId ||
          (group.startId === "prologue" &&
            progress.current_chapter_id === "chapter_1"));

      setHasProgress(hasGroupProgress);

      if (chapterIdParam && !hasGroupProgress) {
        setShowStory(true);
      }

      setCheckingProgress(false);
    };
    loadChildId();
  }, [selectedChildId, chapterIdParam]);

  const handleContinue = () => {
    setShowStory(true);
  };

  const handleStartFresh = async () => {
    if (childId && chapterGroupStartId) {
      const progress = await getChildProgress(childId, "fable-friends");
      await setChapterStart(
        childId,
        chapterGroupStartId,
        progress?.completed_chapters || [],
      );
      setHasProgress(true);
    }
    setShowStory(true);
  };

  const handleComplete = () => {
    setShowStory(false);
    setHasProgress(false);
    router.back();
  };

  const handleChapterComplete = async (
    chapterId: string,
    chapterTitle: string,
  ) => {
    setShowStory(false);
    setHasProgress(false);

    if (chapterId === "chapter_3" && childId) {
      await awardAchievementByCriteria(childId, "story_complete_fable_friends");
      setShowStoryCompletePopup(true);
      return;
    }

    setCompletedChapterTitle(chapterTitle);
    setShowChapterCompletePopup(true);
  };

  if (!childId || checkingProgress) {
    return (
      <View className="flex-1 bg-amber-50 justify-center items-center">
        <Text className="text-lg">Loading...</Text>
      </View>
    );
  }

  if (!showStory && hasProgress && childId) {
    return (
      <View className="flex-1 bg-amber-50 justify-center items-center p-8">
        <View className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-md">
          <Text
            className="text-2xl text-green-600 text-center mb-4"
            style={{ fontFamily: "LilitaOne_400Regular" }}
          >
            Welcome Back!
          </Text>
          <Text
            className="text-base text-gray-700 text-center mb-8"
            style={{ fontFamily: "Pangolin_400Regular" }}
          >
            You have a story in progress. Would you like to continue where you
            left off?
          </Text>

          <Pressable
            onPress={handleContinue}
            className="bg-green-500 rounded-xl p-4 mb-4"
          >
            <Text
              className="text-white text-center text-lg"
              style={{ fontFamily: "LilitaOne_400Regular" }}
            >
              Continue Story
            </Text>
          </Pressable>

          <Pressable
            onPress={handleStartFresh}
            className="bg-yellow-500 rounded-xl p-4"
          >
            <Text
              className="text-white text-center text-lg"
              style={{ fontFamily: "LilitaOne_400Regular" }}
            >
              Start from Beginning
            </Text>
          </Pressable>

          <Pressable onPress={() => router.back()} className="mt-4 p-2">
            <Text
              className="text-gray-500 text-center"
              style={{ fontFamily: "LilitaOne_400Regular" }}
            >
              Go Back
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (showChapterCompletePopup) {
    return (
      <View className="flex-1 bg-amber-50 justify-center items-center p-8">
        <View className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-md">
          <Text
            className="text-2xl text-green-600 text-center mb-4"
            style={{ fontFamily: "LilitaOne_400Regular" }}
          >
            Chapter Complete!
          </Text>
          <Text
            className="text-base text-gray-700 text-center mb-8"
            style={{ fontFamily: "Pangolin_400Regular" }}
          >
            You finished {completedChapterTitle}. Great job!
          </Text>

          <Pressable
            onPress={() => {
              setShowChapterCompletePopup(false);
              router.replace("/child/levelselect");
            }}
            className="bg-green-500 rounded-xl p-4"
          >
            <Text
              className="text-white text-center text-lg"
              style={{ fontFamily: "LilitaOne_400Regular" }}
            >
              Back to Map
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (showStoryCompletePopup) {
    return (
      <View className="flex-1 bg-amber-50 justify-center items-center p-8">
        <View className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-md">
          <Text
            className="text-2xl text-green-600 text-center mb-4"
            style={{ fontFamily: "LilitaOne_400Regular" }}
          >
            Story Complete!
          </Text>
          <Text
            className="text-base text-gray-700 text-center mb-8"
            style={{ fontFamily: "Pangolin_400Regular" }}
          >
            You finished The tale of little red adventure and earned a new
            achievement!
          </Text>

          <Pressable
            onPress={() => {
              setShowStoryCompletePopup(false);
              router.replace("/child/levelselect");
            }}
            className="bg-green-500 rounded-xl p-4"
          >
            <Text
              className="text-white text-center text-lg"
              style={{ fontFamily: "LilitaOne_400Regular" }}
            >
              Back to Map
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setShowStoryCompletePopup(false);
              router.replace("/child/(child-tabs)/achievements");
            }}
            className="bg-yellow-500 rounded-xl p-4 mt-4"
          >
            <Text
              className="text-white text-center text-lg"
              style={{ fontFamily: "LilitaOne_400Regular" }}
            >
              View Achievements
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-amber-50">
      <StoryPlayer
        childId={childId}
        storyId="fable-friends"
        chapterGroupStartId={chapterGroupStartId || undefined}
        chapterGroupEndId={chapterGroupEndId || undefined}
        onChapterComplete={handleChapterComplete}
        onComplete={handleComplete}
        onGoBack={handleComplete}
      />
    </View>
  );
}
