import { Text, View } from "react-native";
import * as Progress from "react-native-progress";

export default function OverviewTab() {
  return (
    <View className="flex-1 rounded-lg gap-3">
      <View className="bg-white rounded-2xl p-5 shadow-sm">
        <View className="flex-row items-center mb-4">
          <View className="w-12 h-12 bg-yellow-400 rounded-full mr-3" />
          <View>
            <Text className="text-lg font-bold">Child Name</Text>
            <Text className="text-gray-400 text-sm">
              Last active: 0 hours ago
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 bg-green-50 rounded-2xl p-4 items-center">
            <Text className="text-green-600 text-3xl font-bold mb-1">3</Text>
            <Text className="text-gray-500 text-sm">Animals</Text>
            <Text className="text-gray-500 text-sm">Collected</Text>
          </View>
          <View className="flex-1 bg-orange-50 rounded-2xl p-4 items-center">
            <Text className="text-orange-500 text-3xl font-bold mb-1">0m</Text>
            <Text className="text-gray-500 text-sm">Screen Time</Text>
            <Text className="text-gray-500 text-sm">Today</Text>
          </View>
        </View>
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 bg-white rounded-2xl p-5 shadow-sm">
          <Text className="font-bold text-gray-700 mb-1">Collection</Text>
          <Text className="font-bold text-gray-700 mb-3">Progress</Text>
          <Text className="text-gray-400 text-sm mb-2">3/10</Text>
          <Progress.Bar
            progress={0.3}
            width={null}
            height={8}
            color="#22c55e"
            unfilledColor="#e5e7eb"
            borderWidth={0}
            borderRadius={4}
          />
        </View>

        <View className="flex-1 bg-white rounded-2xl p-5 shadow-sm">
          <Text className="font-bold text-gray-700 mb-3">Learning Level</Text>
          <View className="bg-orange-400 rounded-full px-4 py-2 self-start mb-2">
            <Text className="text-white font-bold text-sm">Level 3</Text>
          </View>
          <Text className="text-4xl">🏆</Text>
        </View>
      </View>

      <View className="flex-1 bg-white rounded-2xl p-5 shadow-sm">
        <Text className="text-black font-bold text-lg mb-4">
          Favorite Animals
        </Text>
        <View className="flex-row gap-4">
          <View className="items-center">
            <Text className="text-3xl mb-1">🐄</Text>
            <Text className="text-gray-600 text-sm">Cow</Text>
          </View>
          <View className="items-center">
            <Text className="text-3xl mb-1">🐷</Text>
            <Text className="text-gray-600 text-sm">Pig</Text>
          </View>
          <View className="items-center">
            <Text className="text-3xl mb-1">🐔</Text>
            <Text className="text-gray-600 text-sm">Chicken</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
