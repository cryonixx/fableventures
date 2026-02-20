import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { ChildHeader } from "../../../components/child_components/ChildHeader";
import { getChildNameById } from "../../../database/data/child";
import { useCollectedAnimalsCount } from "../../../hooks/useCollectedAnimalsCount";

export default function Profile() {
  // TODO: Replace with actual child ID from app state or navigation params
  const childId = 1;
  const [childName, setChildName] = useState<string>("");
  const collectedCount = useCollectedAnimalsCount();

  useEffect(() => {
    const fetchChildName = async () => {
      try {
        const result = await getChildNameById(childId);
        if (result) {
          setChildName(`${result.firstName} ${result.lastName}`);
        } else {
          setChildName("Child not found");
        }
      } catch (error) {
        setChildName("Error fetching name");
      }
    };
    fetchChildName();
  }, [childId]);

  return (
    <View className={["flex-1", "bg-amber-50"].join(" ")}>
      <ChildHeader currentprogress={collectedCount} />
      <ScrollView className={["flex-1", "w-full"].join(" ")}>
        <View className={["p-4", "items-center"].join(" ")}>
          <Text
            className="text-2xl mb-2"
            style={{ fontFamily: "LilitaOne_400Regular" }}
          >
            {childName}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
