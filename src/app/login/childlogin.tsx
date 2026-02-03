import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import ChildCard from "../../components/ChildCard";
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
          "m-4",
        ].join(" ")}
      >
        <View className="w-full">
          <Text className="text-center text-xl text-green-500">
            Hello! Tap your name to continue your adventure!
          </Text>
        </View>

        <ScrollView
          className="mt-4 w-full flex-1 border-2 border-green-500 rounded-xl"
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChildCard name="Alice"></ChildCard>
        </ScrollView>

        <Pressable
          onPress={() => router.push("/child/(child-tabs)/library")}
          className={[
            "mt-4",
            "w-full",
            "items-center",
            "rounded-xl",
            "bg-yellow-500",
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
