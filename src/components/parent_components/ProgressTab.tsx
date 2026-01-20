import { Text, View } from "react-native";
import * as Progress from "react-native-progress";

export default function ProgressTab() {
  return (
    <View className="flex bg-white rounded-xl p-4 justify-center shadow-sm gap-2">
      <Text className="text-lg my-2">Learning Progress</Text>

      <View className="flex-row">
        <Text className="flex-1 text-md text-gray-700 my-1">
          Animals Discovered
        </Text>
        <Text className="flex-2 text-md text-gray-700 my-1">3/10</Text>
      </View>

      <Progress.Bar
        progress={0.3}
        width={null}
        height={8}
        color="#22c55e"
        unfilledColor="#e5e7eb"
        borderWidth={0}
        borderRadius={4}
      />

      <View className="flex-row">
        <Text className="flex-1 text-md text-gray-700 my-1">Facts Learned</Text>
        <Text className="flex-2 text-md text-gray-700 my-1">25/50</Text>
      </View>

      <Progress.Bar
        progress={0.5}
        width={null}
        height={8}
        color="#22c55e"
        unfilledColor="#e5e7eb"
        borderWidth={0}
        borderRadius={4}
      />

      <View className="flex-row">
        <Text className="flex-1 text-md text-gray-700 my-1">
          Habitats Explored
        </Text>
        <Text className="flex-2 text-md text-gray-700 my-1">1/2</Text>
      </View>

      <Progress.Bar
        progress={0.5}
        width={null}
        height={8}
        color="#22c55e"
        unfilledColor="#e5e7eb"
        borderWidth={0}
        borderRadius={4}
        className="mb-4"
      />
    </View>
  );
}
