import { Text, TouchableOpacity, View } from "react-native";

export default function SettingsTab() {
  return (
    <View className="flex-1 rounded-lg gap-3">
      <View className="bg-white rounded-2xl p-5 shadow-sm">
        <Text className="text-lg my-2">Content Settings</Text>

        <View className="flex-row items-center py-2 border-b border-gray-100">
          <Text className="flex-1 text-md text-gray-700">Difficulty Level</Text>
          <TouchableOpacity className="bg-green-400 rounded-full px-4 py-1">
            <Text className="text-white text-sm font-medium">Age Appropriate</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center py-2 border-b border-gray-100">
          <Text className="flex-1 text-md text-gray-700">Narration Speed</Text>
          <View className="border border-gray-200 rounded-full px-4 py-1">
            <Text className="text-sm text-gray-700">Normal</Text>
          </View>
        </View>

        <View className="flex-row items-center py-2">
          <Text className="flex-1 text-md text-gray-700">Daily Screen Time Limit</Text>
          <View className="border border-gray-200 rounded-full px-4 py-1">
            <Text className="text-sm text-gray-700">60 minutes</Text>
          </View>
        </View>
      </View>

      {/* Educational Tips */}
      <View className="bg-white rounded-2xl p-5 shadow-sm">
        <Text className="text-lg font-bold mb-3">Educational Tips</Text>

        <View className="bg-green-50 rounded-xl p-3 mb-2">
          <Text className="text-sm leading-5 text-gray-700">
            📝 Encourage your child to describe the animals they find to reinforce learning.
          </Text>
        </View>

        <View className="bg-yellow-50 rounded-xl p-3 mb-2">
          <Text className="text-sm leading-5 text-gray-700">
            🎯 Try visiting a real farm together to connect digital learning with real experiences.
          </Text>
        </View>
      </View>

    </View>
  );
}