import { ScrollView, Text, View } from "react-native";
import { ChildHeader } from "../../components/child_components/ChildHeader";

export default function Favorites() {
  return (
    <View className="flex-1 bg-amber-50">
      <ChildHeader />
      <ScrollView className="flex-1 w-full">
        <View className="p-4">
          <Text>Your scrollable content goes here</Text>
        </View>
      </ScrollView>
    </View>
  );
}
