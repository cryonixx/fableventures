import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import IndexReturn from "../../components/IndexReturn";

export default function ChildLogin() {
  return (
    <View className="flex-1 items-center justify-center bg-green-500">
      <View className="w-full h-1/10 flex m-4">
        <IndexReturn />
      </View>
      <View
        className={[
          "h-3/5",
          "w-4/5",
          "items-start",
          "rounded-xl",
          "bg-white",
          "p-8",
          "drop-shadow-lg",
          "m-5",
        ].join(" ")}
      >
        <View className="w-full">
          <Text className="text-center text-xl text-green-500">
            Hello! Tap your name to continue your adventure!
          </Text>
        </View>

        <View className="mt-4 w-full h-2/5 border-2 border-green-500 rounded-xl items-center justify-center">
          <Text className="text-gray-950 text-lg font-bold">
            • Child User 1
          </Text>
        </View>

        <Pressable
          onPress={() => router.push("/(child-tabs)/home")}
          className={[
            "mt-4",
            "w-full",
            "items-center",
            "rounded-xl",
            "bg-yellow-400",
          ].join(" ")}
        >
          <Text className={["p-4", "font-bold", "text-white"].join(" ")}>
            Let's go!
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
