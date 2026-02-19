import { useImage } from "@/src/hooks/useImage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

export default function AnimalDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const name = (params.name as string) || "Unknown";
  const classification = (params.classification as string) || "";
  const image = useImage(name);

  return (
    <ScrollView className={["flex-1", "bg-amber-50"].join(" ")}>
      <View
        className={[
          "w-full",
          "rounded-b-2xl",
          "bg-green-400",
          "p-4",
          "pb-6",
          "drop-shadow-lg",
        ].join(" ")}
      >
        <View
          className={[
            "flex-row",
            "items-center",
            "justify-between",
            "mt-8",
          ].join(" ")}
        >
          <Pressable
            onPress={() => router.back()}
            className={["p-2"].join(" ")}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </Pressable>

          <View className={["flex-row", "items-center"].join(" ")}>
            <Pressable
              className={["p-2", "mr-2", "rounded-full", "bg-white/10"].join(
                " ",
              )}
            >
              <Ionicons name="heart" size={18} color="#fff" />
            </Pressable>
            <Pressable
              className={["p-2", "rounded-full", "bg-white/10"].join(" ")}
            >
              <Ionicons name="share-social" size={18} color="#fff" />
            </Pressable>
          </View>
        </View>

        <View className={["items-center", "mt-6", "mb-2"].join(" ")}>
          <View
            className={["w-56", "h-44", "items-center", "justify-center"].join(
              " ",
            )}
          >
            <Image
              source={image}
              className="border-4 border-white rounded-lg"
              style={{ width: 200, height: 200 }}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      <View className={["mt-4", "px-4"].join(" ")}>
        <View
          className={["bg-white", "rounded-xl", "p-4", "drop-shadow-lg"].join(
            " ",
          )}
        >
          <View
            className={["flex-row", "items-center", "justify-between"].join(
              " ",
            )}
          >
            <View>
              <Text className={["text-2xl", "font-bold"].join(" ")}>
                {name}
              </Text>
              <Text className={["text-sm", "text-gray-500", "mt-1"].join(" ")}>
                {classification}
              </Text>
            </View>
            <Pressable
              className={["p-2", "bg-amber-50", "rounded-full"].join(" ")}
            >
              <Ionicons name="volume-high" size={18} color="#f59e0b" />
            </Pressable>
          </View>
        </View>

        <View className={["flex-row", "justify-around", "mt-4"].join(" ")}>
          <Pressable
            className={[
              "px-4",
              "py-2",
              "bg-white",
              "rounded-full",
              "drop-shadow",
            ].join(" ")}
          >
            <Text>Facts</Text>
          </Pressable>
          <Pressable
            className={[
              "px-4",
              "py-2",
              "bg-white",
              "rounded-full",
              "drop-shadow",
            ].join(" ")}
          >
            <Text>Habitat</Text>
          </Pressable>
          <Pressable
            className={[
              "px-4",
              "py-2",
              "bg-white",
              "rounded-full",
              "drop-shadow",
            ].join(" ")}
          >
            <Text>Diet</Text>
          </Pressable>
        </View>

        <View className={["mt-4", "pb-12", "px-2"].join(" ")}>
          <View
            className={["bg-white", "rounded-xl", "p-4", "drop-shadow"].join(
              " ",
            )}
          >
            <Text className={["font-semibold", "mb-2"].join(" ")}>
              Social Butterfly
            </Text>
            <Text className={["text-sm", "text-gray-600"].join(" ")}>
              Did you know? {name} are herd animals. This means they like
              spending time in large groups around their friends and family!
            </Text>
          </View>

          <View
            className={[
              "bg-white",
              "rounded-xl",
              "p-4",
              "drop-shadow",
              "mt-4",
            ].join(" ")}
          >
            <Text className={["font-semibold", "mb-2"].join(" ")}>
              Amazing Feature
            </Text>
            <Text className={["text-sm", "text-gray-600"].join(" ")}>
              Interesting facts about {name} will go here. Replace this with
              real data.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
