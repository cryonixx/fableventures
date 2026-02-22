import { Text, View } from "react-native";

export default function ActivityTab() {
  return (
    <View className="flex bg-white rounded-xl p-4 justify-center shadow-sm gap-2">
      <Text className="text-lg my-2">Recent Activity</Text>

      <View className="flex-row gap-3">
        <View className="flex-1 bg-green-50 rounded-2xl p-4">
          
          <View className="flex-row">
            <View className="w-12 h-12 bg-green-400 rounded-full items-center">
              <Text className="text-m text-center">📷</Text>
            </View>
          </View>

          <View>
            <Text className="text-lg">
              Scan with 🐄Cow
            </Text>

            <Text className="text-gray-400 text-sm">
              10:30 AM • 5min
            </Text>
          </View>



        </View>

      </View>




      
    </View>
  );
}
