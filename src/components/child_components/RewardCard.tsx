import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, Text, View } from "react-native";

type RewardCardProps = {
  name: string;
  description: string;
  image?: string;
  isLocked?: boolean;
};

export default function RewardCard({
  name,
  description,
  image,
  isLocked = false,
}: RewardCardProps) {
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
            "font-bold",
            "mb-1",
            isLocked ? "text-gray-400" : "text-gray-800",
          ].join(" ")}
        >
          {isLocked ? "???" : name}
        </Text>
        <Text
          className={[
            "text-sm",
            "mb-1",
            isLocked ? "text-gray-400" : "text-gray-500",
          ].join(" ")}
        >
          {isLocked ? "Meet an animal to unlock" : description}
        </Text>
      </View>
      {isLocked ? (
        <View className="bg-gray-300 rounded-full w-16 h-16 items-center justify-center">
          <MaterialIcons name="lock" size={32} color="#9CA3AF" />
        </View>
      ) : (
        <Image
          source={
            image
              ? { uri: image }
              : require("../../../assets/images/placeholder.png")
          }
          style={{ width: 64, height: 64 }}
        />
      )}
    </View>
  );
}
