import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

type TabInfo = {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export default function TabLayout() {
  const tabsInfo: TabInfo[] = [
    { name: "library", icon: "book" },
    { name: "achievements", icon: "trophy" },
    { name: "favorites", icon: "heart" },
    { name: "profile", icon: "person" },
  ];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#10b981",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e5e7eb",
          paddingBottom: 12,
          height: 85,
        },
      }}
    >
      {tabsInfo.map(x => (
        <Tabs.Screen
          name={x.name}
          options={{
            title: x.name.replace(/(?:^|\s)\w/g, y => y.toUpperCase()),
            tabBarIcon: ({ color }) => (
              <Ionicons name={x.icon} color={color} size={18} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
