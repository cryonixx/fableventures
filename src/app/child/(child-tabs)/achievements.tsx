import { ScrollView, View } from "react-native";
import { ChildHeader } from "../../../components/child_components/ChildHeader";
import RewardCard from "../../../components/child_components/RewardCard";
export default function Achievements() {
  return (
    <View className="flex-1 bg-amber-50">
      <ChildHeader />
      <ScrollView className="flex-1 w-full">
        <View className="p-4">
          <RewardCard
            name="Beef Burger"
            description="Juicy beef patty with fresh veggies."
          />
          <RewardCard
            name="Pancakes"
            description="Fluffy pancakes with syrup."
          />
          <RewardCard
            name="Pancakes"
            description="Fluffy pancakes with syrup."
          />
          <RewardCard
            name="Pancakes"
            description="Fluffy pancakes with syrup."
          />
        </View>
      </ScrollView>
    </View>
  );
}
