import { useChildContext } from "@/src/context/ChildContext";
import { getChildProgress } from "@/src/database/storyManager";
import { getTestChildId } from "@/src/database/testData";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  Text,
  View,
} from "react-native";

type Level = {
  id: number;
  title: string;
  description: string;
  chapter_id: string;
};

// TODO: Load this from database based on child progress
const LEVELS: Level[] = [
  {
    id: 1,
    title: "Little Red Riding Hood",
    description: "A classic tale reimagined",
    chapter_id: "chapter_1",
  },
  {
    id: 2,
    title: "Level 2",
    description: "Coming soon",
    chapter_id: "chapter_2",
  },
  {
    id: 3,
    title: "Level 3",
    description: "Coming soon",
    chapter_id: "chapter_3",
  },
];

export default function LevelSelectScreen() {
  const router = useRouter();
  const { selectedChildId } = useChildContext();
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [hasAnyProgress, setHasAnyProgress] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [pulseAnim]);

  useEffect(() => {
    const loadProgress = async () => {
      const childId = selectedChildId || (await getTestChildId());
      const progress = await getChildProgress(childId, "fable-friends");

      if (progress && progress.current_chapter_id) {
        setHasAnyProgress(true);
        setCurrentChapterId(progress.current_chapter_id);
        setCompletedChapters(progress.completed_chapters || []);
      } else {
        setHasAnyProgress(false);
        setCurrentChapterId(null);
        setCompletedChapters([]);
      }
    };

    loadProgress();
  }, [selectedChildId]);

  const handleLevelSelect = (levelId: number, chapterId: string) => {
    // Navigate to storybook with the selected chapter
    router.push({
      pathname: "/child/storybook",
      params: { chapterId },
    });
  };

  // Define responsive positions based on screen dimensions
  const getLevelPosition = (index: number) => {
    const mapHeight = screenHeight;

    // Create a responsive grid with custom spacing
    // Adjust these percentages for your specific map layout
    const positions = [
      { top: mapHeight * 0.78, left: screenWidth * 0.15 }, // Level 1 - bottom left
      { top: mapHeight * 0.6, left: screenWidth * 0.6 }, // Level 2 - middle right
      { top: mapHeight * 0.3, left: screenWidth * 0.7 }, // Level 3 - top right
    ];

    return positions[index] || { top: 0, left: 0 };
  };

  // Static mapping of level images (require must be static)
  const levelImageMap: { [key: number]: { unlocked: any; locked: any } } = {
    1: {
      unlocked: require("@/assets/images/ui/lvl1.png"),
      locked: require("@/assets/images/ui/lvl1.png"),
    },
    2: {
      unlocked: require("@/assets/images/ui/lvl2.png"),
      locked: require("@/assets/images/ui/lvl2locked.png"),
    },
    3: {
      unlocked: require("@/assets/images/ui/lvl3.png"),
      locked: require("@/assets/images/ui/lvl3locked.png"),
    },
  };

  const getCoinImage = (level: Level, unlocked: boolean) => {
    const images = levelImageMap[level.id];
    if (!images) return require("@/assets/images/ui/lvl1.png");

    return unlocked ? images.unlocked : images.locked;
  };

  const isLevelUnlocked = (level: Level) => {
    if (level.id === 1) return true;

    if (!hasAnyProgress) return false;
    if (level.id === 2) {
      return (
        completedChapters.includes("chapter_1") ||
        currentChapterId === "chapter_2"
      );
    }
    if (level.id === 3) {
      return (
        completedChapters.includes("chapter_2") ||
        currentChapterId === "chapter_3"
      );
    }

    return false;
  };

  return (
    <ImageBackground
      source={require("@/assets/images/ui/levelbg.png")}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="absolute top-10 left-4 z-10">
        <Pressable
          onPress={() => router.replace("/child/(child-tabs)/library")}
          className="bg-white/90 rounded-full px-4 py-2"
        >
          <Text
            className="text-green-700 text-base"
            style={{ fontFamily: "LilitaOne_400Regular" }}
          >
            Go to Home
          </Text>
        </Pressable>
      </View>

      {/* Coins Container */}
      <View
        style={{
          position: "relative",
          flex: 1,
        }}
      >
        {LEVELS.map((level, index) => {
          const position = getLevelPosition(index);
          const unlocked = isLevelUnlocked(level);
          const canPlay = unlocked || level.id === 1;
          const showLocked = !unlocked && level.id !== 1;

          return (
            <View
              key={level.id}
              style={{
                position: "absolute",
                top: position.top,
                left: position.left,
              }}
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      scale: unlocked
                        ? pulseAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.06],
                          })
                        : 1,
                    },
                  ],
                  opacity: unlocked
                    ? pulseAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.92],
                      })
                    : 0.6,
                }}
              >
                <Pressable
                  onPress={() => {
                    if (canPlay) {
                      handleLevelSelect(level.id, level.chapter_id);
                    }
                  }}
                  disabled={!canPlay}
                  className="items-center justify-center"
                >
                  {/* Coin Image */}
                  <Image
                    source={getCoinImage(level, !showLocked)}
                    style={{
                      width: 80,
                      height: 80,
                      opacity: showLocked ? 0.6 : 1,
                    }}
                    resizeMode="contain"
                  />
                </Pressable>
              </Animated.View>
            </View>
          );
        })}
      </View>
    </ImageBackground>
  );
}
