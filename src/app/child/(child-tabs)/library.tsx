import { ScrollView, Text, View } from "react-native";
import { ChildHeader } from "../../../components/child_components/ChildHeader";

export default function Library() {
  return (
    <View className={["flex-1", "bg-amber-50"].join(" ")}>
      <ChildHeader />
      <ScrollView className={["flex-1", "w-full"].join(" ")}>
        <View className={["p-4"].join(" ")}>
          <Text>Your scrollable content goes here</Text>
        </View>
      </ScrollView>
    </View>
  );
}
