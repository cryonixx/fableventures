import { Pressable, ScrollView, Text, View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 bg-amber-50">
      <View className="h-1/4 w-full rounded-b-xl bg-green-400 p-5 drop-shadow-lg">
        <Text className="mt-8 text-2xl text-white font-bold">
          Fable Friends
        </Text>
        <Text className="text-md text-white">
          Learn more about your animal friends!
        </Text>

        <View className="mt-3 h-2/5 w-full rounded-lg bg-white p-4 drop-shadow-md">
          <View className="flex-row justify-between gap-2">
            <Pressable className="flex-1 bg-neutral-100 rounded-lg p-2">
              <Text className="text-md text-neutral-500 font-bold text-center">
                Puzzles
              </Text>
            </Pressable>
            <Pressable className="flex-1 bg-neutral-100 rounded-lg p-2">
              <Text className="text-md text-neutral-500 font-bold text-center">
                Short Stories
              </Text>
            </Pressable>
            <Pressable className="flex-1 bg-neutral-100 rounded p-2">
              <Text className="text-md text-neutral-500 font-bold text-center">
                Mini-games
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 w-full">
        <View className="p-4">
          <Text>Your scrollable content goes here</Text>
        </View>
      </ScrollView>
    </View>
  );
}
