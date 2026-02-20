import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, Pressable, Text, View } from "react-native";
import { ProfileCard } from "../../hooks/useChildProfileScreen";

type ProfileTopCardProps = {
  card: ProfileCard;
  favoriteAnimals: string[];
  getProfileThumbnail: (name?: string) => any;
  isStoryCompleteCriteria: (criteria?: string) => boolean;
  onPress: () => void;
};

export default function ProfileTopCard({
  card,
  favoriteAnimals,
  getProfileThumbnail,
  isStoryCompleteCriteria,
  onPress,
}: ProfileTopCardProps) {
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
      className={`w-full min-h-28 rounded-2xl p-4 ${cardBgClass}`}
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

      {card.id === "achievement" ? (
        <View className="mt-3 flex-row items-center justify-between rounded-xl bg-white p-3">
          <View className="mr-3 flex-1">
            <Text
              className="text-base text-neutral-800"
              numberOfLines={1}
              style={{ fontFamily: "LilitaOne_400Regular" }}
            >
              {card.value}
            </Text>
            <Text
              className="mt-1 text-sm text-neutral-500"
              numberOfLines={2}
              style={{ fontFamily: "Pangolin_400Regular" }}
            >
              {card.detail}
            </Text>
          </View>
          {card.value === "No achievements yet" ? (
            <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-gray-400 bg-gray-100">
              <MaterialIcons name="emoji-events" size={34} color="#9CA3AF" />
            </View>
          ) : (
            <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-yellow-600 bg-white">
              {isStoryCompleteCriteria(card.thumbnailKey) ? (
                <MaterialIcons name="menu-book" size={34} color="#D4AF37" />
              ) : (
                <Image
                  source={getProfileThumbnail(card.thumbnailKey)}
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
      ) : (
        <View className="mt-3 flex-row items-center rounded-xl bg-white/70 p-3">
          {card.id === "favorite" && card.value === "No favorite yet" ? (
            <View className="mr-3 h-[72px] w-[72px] items-center justify-center rounded-lg bg-gray-200">
              <MaterialIcons name="help-outline" size={32} color="#6B7280" />
            </View>
          ) : (
            <Image
              source={getProfileThumbnail(card.thumbnailKey)}
              className="mr-3 h-[72px] w-[72px] rounded-lg bg-amber-200"
              resizeMode="cover"
            />
          )}
          <View className="flex-1">
            <Text
              className={`text-base ${card.textClass}`}
              numberOfLines={1}
              style={{ fontFamily: "Pangolin_400Regular" }}
            >
              {card.value}
            </Text>
            <Text
              className={`mt-0.5 text-xs ${card.textClass}`}
              numberOfLines={1}
              style={{ fontFamily: "Pangolin_400Regular" }}
            >
              {card.detail}
            </Text>
            {card.id === "favorite" && favoriteAnimals.length > 0 && (
              <View className="mt-2 flex-row items-center">
                {favoriteAnimals.slice(0, 4).map((animalName, index) => (
                  <View
                    key={`${animalName}-${index}`}
                    className="mr-1.5 h-10 w-10 items-center justify-center rounded-lg bg-lime-200"
                  >
                    <Image
                      source={getProfileThumbnail(animalName)}
                      style={{ width: 26, height: 26 }}
                      resizeMode="contain"
                    />
                  </View>
                ))}
                {favoriteAnimals.length > 4 && (
                  <View className="h-10 min-w-10 items-center justify-center rounded-lg bg-lime-300 px-1.5">
                    <Text
                      className="text-xs text-lime-900"
                      style={{ fontFamily: "LilitaOne_400Regular" }}
                    >
                      +{favoriteAnimals.length - 4}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      )}
    </Pressable>
  );
}
