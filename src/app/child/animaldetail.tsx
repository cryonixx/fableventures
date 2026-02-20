import { useImage } from "@/src/hooks/useImage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useChildContext } from "../../context/ChildContext";
import {
  isFavoriteAnimal,
  toggleFavoriteAnimal,
} from "../../database/favoriteAnimalsManager";
import { getTestChildId } from "../../database/testData";

export default function AnimalDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { selectedChildId } = useChildContext();
  const name = (params.name as string) || "Unknown";
  const classification = (params.classification as string) || "";
  const image = useImage(name);
  const [isFavorite, setIsFavorite] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadFavoriteState = async () => {
        const childId = selectedChildId || (await getTestChildId());
        const currentState = await isFavoriteAnimal(childId, name);
        setIsFavorite(currentState);
      };

      loadFavoriteState();
    }, [name, selectedChildId]),
  );

  const onToggleFavorite = async () => {
    const childId = selectedChildId || (await getTestChildId());
    const nextState = await toggleFavoriteAnimal(childId, name);
    setIsFavorite(nextState);
  };

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
              onPress={onToggleFavorite}
              className={[
                "px-4",
                "py-2.5",
                "rounded-full",
                isFavorite ? "bg-rose-500" : "bg-white/20",
                "border",
                isFavorite ? "border-rose-500" : "border-white/30",
              ].join(" ")}
            >
              <View className={["flex-row", "items-center"].join(" ")}>
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={24}
                  color="#fff"
                />
                <Text
                  className={["ml-2", "text-white", "text-base"].join(" ")}
                  style={{ fontFamily: "LilitaOne_400Regular" }}
                >
                  Favorite
                </Text>
              </View>
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
              <Text
                className={["text-2xl"].join(" ")}
                style={{ fontFamily: "LilitaOne_400Regular" }}
              >
                {name}
              </Text>
              <Text
                className={["text-sm", "text-gray-500", "mt-1"].join(" ")}
                style={{ fontFamily: "Pangolin_400Regular" }}
              >
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
            <Text style={{ fontFamily: "LilitaOne_400Regular" }}>Facts</Text>
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
            <Text style={{ fontFamily: "LilitaOne_400Regular" }}>Habitat</Text>
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
            <Text style={{ fontFamily: "LilitaOne_400Regular" }}>Diet</Text>
          </Pressable>
        </View>

        <View className={["mt-4", "pb-12", "px-2"].join(" ")}>
          <View
            className={["bg-white", "rounded-xl", "p-4", "drop-shadow"].join(
              " ",
            )}
          >
            <Text
              className={["mb-2"].join(" ")}
              style={{ fontFamily: "LilitaOne_400Regular" }}
            >
              Social Butterfly
            </Text>
            <Text
              className={["text-sm", "text-gray-600"].join(" ")}
              style={{ fontFamily: "Pangolin_400Regular" }}
            >
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
            <Text
              className={["mb-2"].join(" ")}
              style={{ fontFamily: "LilitaOne_400Regular" }}
            >
              Amazing Feature
            </Text>
            <Text
              className={["text-sm", "text-gray-600"].join(" ")}
              style={{ fontFamily: "Pangolin_400Regular" }}
            >
              Interesting facts about {name} will go here. Replace this with
              real data.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
