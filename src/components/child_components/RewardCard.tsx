import { useImage } from "@/src/hooks/useImage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, Text, View } from "react-native";

type RewardCardProps = {
  name: string;
  description: string;
  animalName?: string;
  image?: string;
  isLocked?: boolean;
};

export default function RewardCard({
  name,
  description,
  animalName,
  image,
  isLocked = false,
}: RewardCardProps) {
  const animalImage = useImage(animalName);
  const normalizedCriteria = animalName
    ?.toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
  const isStoryCompleteAchievement =
    normalizedCriteria === "storycompletefablefriends";

  return (
    <View
      className={[
        "flex-row",
        "items-center",
        isLocked ? "bg-gray-200" : "bg-white",
        "rounded-xl",
        "p-4",
        "m-2",
        "drop-shadow-lg",
        "justify-between",
      ].join(" ")}
    >
      <View className="flex-1">
        <Text
          className={[
            "text-lg",
            "mb-1",
            isLocked ? "text-gray-400" : "text-gray-800",
          ].join(" ")}
          style={{ fontFamily: "LilitaOne_400Regular" }}
        >
          {isLocked ? "???" : name}
        </Text>
        <Text
          className={[
            "text-sm",
            "mb-1",
            isLocked ? "text-gray-400" : "text-gray-500",
          ].join(" ")}
          style={{ fontFamily: "Pangolin_400Regular" }}
        >
          {isLocked
            ? isStoryCompleteAchievement
              ? "Finish the story to unlock"
              : "Meet an animal to unlock"
            : description}
        </Text>
      </View>
      {isLocked ? (
        <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-gray-400 bg-gray-300">
          <MaterialIcons name="lock" size={32} color="#9CA3AF" />
        </View>
      ) : (
        <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-yellow-600 bg-white">
          {isStoryCompleteAchievement ? (
            <MaterialIcons name="menu-book" size={34} color="#D4AF37" />
          ) : (
            <Image
              source={image ? { uri: image } : animalImage}
              style={{
                width: 44,
                height: 44,
                tintColor: "#D4AF37",
              }}
              resizeMode="contain"
            />
          )}
        </View>
      )}
    </View>
  );
}
