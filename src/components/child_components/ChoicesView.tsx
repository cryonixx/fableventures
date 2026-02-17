import { Pressable, Text, View } from "react-native";

export default function ChoicesView() {
  return (
    <View className="bg-green-500 w-full h-full flex-col justify-center items-center rounded-lg p-4">
      <View className="bg-amber-100 rounded-3xl w-full m-2 p-4">
        <Text className="text-center text-lg font-semibold p-2">
          What would you like to do next?
        </Text>
        <Text className="text-center text-md italic p-2">
          (Read your choice out loud!!)
        </Text>
      </View>
      <Pressable className="bg-green-700 w-full p-6 m-2 rounded-3xl">
        <Text className="text-white text-center">Choice 1</Text>
      </Pressable>
      <Pressable className="bg-green-700 w-full p-6 m-2 rounded-3xl">
        <Text className="text-white text-center">Choice 2</Text>
      </Pressable>
    </View>
  );
}
