import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import ActivityTab from "../components/parent_components/ActivityTab";
import OverviewTab from "../components/parent_components/OverviewTab";
import ParentHeader from "../components/parent_components/ParentHeader";
import ParentTabBar from "../components/parent_components/ParentTabBar";
import ProgressTab from "../components/parent_components/ProgressTab";
import SettingsTab from "../components/parent_components/SettingsTab";

export default function ParentDashboardTest() {
  const [activeTab, setActiveTab] = useState("Overview");
  return (
    <View className="flex-1 bg-amber-50">
      <ParentHeader />
      <ParentTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <ScrollView className="flex-1 w-full">
        <View className="p-4">
          {activeTab === "Overview" && <OverviewTab />}
          {activeTab === "Progress" && <ProgressTab />}
          {activeTab === "Activity" && <ActivityTab />}
          {activeTab === "Settings" && <SettingsTab />}
        </View>
      </ScrollView>
    </View>
  );
}
