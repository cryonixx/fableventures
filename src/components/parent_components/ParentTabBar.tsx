import { Text, TouchableOpacity, View } from "react-native";

interface ParentTabBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ParentTabBar({
  activeTab,
  setActiveTab,
}: ParentTabBarProps) {
  const tabs = ["Overview", "Progress", "Activity", "Settings"];

  return (
    <View className="flex-row bg-neutral-100 w-auto mx-2 my-4 rounded-full shadow-sm">
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => setActiveTab(tab)}
          className={`flex-1 p-1 m-1 rounded-full justify-center items-center ${
            activeTab === tab ? "bg-white" : "bg-neutral-100"
          }`}
        >
          <Text className="text-center text-xs font-semibold p-1">{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
