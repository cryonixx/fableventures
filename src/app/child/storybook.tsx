import StoryPlayer from "@/src/components/child_components/StoryPlayer";
import { useChildContext } from "@/src/context/ChildContext";
import {
    getChildProgress,
    resetChildProgress,
} from "@/src/database/storyManager";
import { getTestChildId } from "@/src/database/testData";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function Storybook() {
  const router = useRouter();
  const [childId, setChildId] = useState<number | null>(null);
  const [hasProgress, setHasProgress] = useState<boolean>(false);
  const [showStory, setShowStory] = useState<boolean>(false);
  const [checkingProgress, setCheckingProgress] = useState(true);
  const { selectedChildId } = useChildContext();

  useEffect(() => {
    const loadChildId = async () => {
      // Use selected child ID from context, fallback to test child
      const id = selectedChildId || (await getTestChildId());
      setChildId(id);

      // Check if there's saved progress
      const progress = await getChildProgress(id, "fable-friends");
      if (progress && progress.current_chapter_id) {
        setHasProgress(true);
      }
      setCheckingProgress(false);
    };
    loadChildId();
  }, [selectedChildId]);

  const handleContinue = () => {
    setShowStory(true);
  };

  const handleStartFresh = async () => {
    if (childId) {
      await resetChildProgress(childId, "fable-friends");
      setHasProgress(false);
    }
    setShowStory(true);
  };

  const handleComplete = () => {
    setShowStory(false);
    setHasProgress(false);
    router.back();
  };

  if (childId === null || checkingProgress) {
    return (
      <View className="flex-1 bg-amber-50 justify-center items-center">
        <Text className="text-lg">Loading...</Text>
      </View>
    );
  }

  if (!showStory && hasProgress) {
    return (
      <View className="flex-1 bg-amber-50 justify-center items-center p-8">
        <View className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-md">
          <Text className="text-2xl font-bold text-green-600 text-center mb-4">
            Welcome Back!
          </Text>
          <Text className="text-base text-gray-700 text-center mb-8">
            You have a story in progress. Would you like to continue where you
            left off?
          </Text>

          <Pressable
            onPress={handleContinue}
            className="bg-green-500 rounded-xl p-4 mb-4"
          >
            <Text className="text-white font-bold text-center text-lg">
              Continue Story
            </Text>
          </Pressable>

          <Pressable
            onPress={handleStartFresh}
            className="bg-yellow-500 rounded-xl p-4"
          >
            <Text className="text-white font-bold text-center text-lg">
              Start from Beginning
            </Text>
          </Pressable>

          <Pressable onPress={() => router.back()} className="mt-4 p-2">
            <Text className="text-gray-500 text-center">Go Back</Text>
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
        onComplete={handleComplete}
        onGoBack={handleComplete}
      />
    </View>
  );
}
