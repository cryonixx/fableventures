import { Pressable, Text, View } from "react-native";

function ParentHeader() {
  return (
    <View className="w-full h-40 flex-row items-center justify-between pt-8 p-4 bg-white drop-shadow-md">
      <View className="flex-auto items-left mt-2">
        <Text className="text-lg font-bold">Parent Dashboard</Text>
        <Text className="text-sm text-gray-600">Manage learning progress</Text>
      </View>
      <Pressable className="bg-amber-50 shadow-sm border-1 flex-auto px-4 py-2 rounded-full m-2">
        <Text className="text-black text-xs text-center font-bold">
          Switch to child
        </Text>
      </Pressable>
      <Pressable className="bg-amber-50 shadow-sm border-1 flex-auto px-4 py-2 rounded-full m-2">
        <Text className="text-black text-xs text-center font-bold">
          Log Out
        </Text>
      </Pressable>
    </View>
  );
}
export default ParentHeader;
