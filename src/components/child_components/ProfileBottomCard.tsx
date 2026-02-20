import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, Pressable, Text, View } from "react-native";
import { ProfileCard } from "../../hooks/useChildProfileScreen";

type ProfileBottomCardProps = {
  card: ProfileCard;
  cardIndex: number;
  getProfileThumbnail: (name?: string) => any;
  onPress: () => void;
};

export default function ProfileBottomCard({
  card,
  cardIndex,
  getProfileThumbnail,
  onPress,
}: ProfileBottomCardProps) {
  // Static mapping for card background color
  const cardBgMap: Record<string, string> = {
    favorite: "bg-lime-100",
    achievement: "bg-amber-100",
    reading: "bg-violet-100",
    recent: "bg-sky-100",
  };
  const cardBgClass = cardBgMap[card.id] || "bg-white";
  return (
    <Pressable
      className={`min-h-28 flex-1 rounded-2xl p-4 ${cardBgClass} ${cardIndex === 1 ? "ml-3" : ""}`}
      onPress={onPress}
      style={({ pressed }) =>
        pressed ? { opacity: 0.75, transform: [{ scale: 0.98 }] } : null
      }
    >
      <Text
        className={`text-base ${card.textClass}`}
        style={{ fontFamily: "LilitaOne_400Regular" }}
      >
        {card.title}
      </Text>
      {card.id === "recent" ? (
        <View className="mt-2 flex-row items-center rounded-xl bg-white/70 p-2.5">
          {card.value === "No stories yet" ? (
            <View className="mr-2 h-10 w-10 items-center justify-center rounded-lg bg-sky-200">
              <MaterialIcons name="menu-book" size={22} color="#075985" />
            </View>
          ) : (
            <Image
              source={getProfileThumbnail(card.thumbnailKey)}
              className="mr-2 h-10 w-10 rounded-lg bg-sky-200"
              resizeMode="cover"
            />
          )}
          <Text
            className={`flex-1 text-sm ${card.textClass}`}
            numberOfLines={2}
            style={{ fontFamily: "Pangolin_400Regular" }}
          >
            {card.value}
          </Text>
        </View>
      ) : (
        <Text
          className={`mt-2 text-sm ${card.textClass}`}
          numberOfLines={2}
          style={{ fontFamily: "Pangolin_400Regular" }}
        >
          {card.value}
        </Text>
      )}
    </Pressable>
  );
}
