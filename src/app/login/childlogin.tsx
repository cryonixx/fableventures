import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import ChildCard from "../../components/ChildCard";
import IndexReturn from "../../components/IndexReturn";
import { useChildContext } from "../../context/ChildContext";
import { Child, getAllChildren } from "../../database/data/child";

export default function ChildLogin() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const { setSelectedChildId: setGlobalChildId } = useChildContext();

  useEffect(() => {
    const loadChildren = async () => {
      const allChildren = await getAllChildren();
      setChildren(allChildren);
    };
    loadChildren();
  }, []);

  const handleChildSelect = (childId: number) => {
    setSelectedChildId(childId);
  };

  const handleContinue = () => {
    if (selectedChildId) {
      setGlobalChildId(selectedChildId);
      router.push("/child/(child-tabs)/library");
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-green-500">
      <View className="w-full h-1/10 flex m-4">
        <IndexReturn />
      </View>
      <View
        className={[
          "h-3/5",
          "w-4/5",
          "items-start",
          "rounded-xl",
          "bg-white",
          "p-8",
          "drop-shadow-lg",
          "m-4",
        ].join(" ")}
      >
        <View className="w-full">
          <Text className="text-center text-xl text-green-500">
            Hello! Tap your name to continue your adventure!
          </Text>
        </View>

        <ScrollView
          className="mt-4 w-full flex-1 border-2 border-green-500 rounded-xl"
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: children.length === 0 ? "center" : "flex-start",
          }}
        >
          {children.length === 0 ? (
            <Text className="text-gray-500">No children found</Text>
          ) : (
            children.map((child) => (
              <ChildCard
                key={child.child_id}
                id={child.child_id}
                name={`${child.child_first_name} ${child.child_last_name}`}
                onPress={() => handleChildSelect(child.child_id)}
                isSelected={selectedChildId === child.child_id}
              />
            ))
          )}
        </ScrollView>

        <Pressable
          onPress={handleContinue}
          disabled={!selectedChildId}
          className={[
            "mt-4",
            "w-full",
            "items-center",
            "rounded-xl",
            selectedChildId ? "bg-yellow-500" : "bg-gray-400",
          ].join(" ")}
        >
          <Text className={["p-4", "font-bold", "text-white"].join(" ")}>
            Let's go!
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
