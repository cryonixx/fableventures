import { ScrollView, View } from "react-native";
import { ChildHeader } from "../../../components/child_components/ChildHeader";
import RewardCard from "../../../components/child_components/RewardCard";
export default function Achievements() {
  return (
    <View className={["flex-1", "bg-amber-50"].join(" ")}>
      <ChildHeader />
      <ScrollView className={["flex-1", "w-full"].join(" ")}>
        <View className={["p-4"].join(" ")}>
          <RewardCard
            name="Named Badge"
            description="Awarded for completing your profile."
          />
          <RewardCard
            name="Named Badge"
            description="Awarded for completing your profile."
          />
          <RewardCard
            name="Named Badge"
            description="Awarded for completing your profile."
          />
          <RewardCard
            name="Named Badge"
            description="Awarded for completing your profile."
          />
          <RewardCard
            name="Named Badge"
            description="Awarded for completing your profile."
          />
          <RewardCard
            name="Named Badge"
            description="Awarded for completing your profile."
          />
          <RewardCard
            name="Named Badge"
            description="Awarded for completing your profile."
          />
        </View>
      </ScrollView>
    </View>
  );
}
