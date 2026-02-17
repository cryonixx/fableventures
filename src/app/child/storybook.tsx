import ChoicesView from "@/src/components/child_components/ChoicesView";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function LevelSelect() {
  return (
    <View className="w-full h-full flex-col">
      <View className="border flex-[3]">
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFyaXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
          }}
          className="w-full h-full rounded-lg"
        />
      </View>
      <View className="border p-2 flex-[2]">
        <ChoicesView />
      </View>
      <View className="bg-green-700 p-4 flex flex-row items-start flex-[0.2]">
        <TouchableOpacity className="bg-amber-100 p-4 rounded-lg flex-[0.3]">
          <Text className="text-green-700 font-bold text-md text-center">
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
