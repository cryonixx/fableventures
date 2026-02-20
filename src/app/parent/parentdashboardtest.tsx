import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import ActivityTab from "../../components/parent_components/ActivityTab";
import OverviewTab from "../../components/parent_components/OverviewTab";
import ParentHeader from "../../components/parent_components/ParentHeader";
import ParentTabBar from "../../components/parent_components/ParentTabBar";
import ProgressTab from "../../components/parent_components/ProgressTab";
import SettingsTab from "../../components/parent_components/SettingsTab";
import { useParentAccessContext } from "../../context/ParentAccessContext";

export default function ParentDashboardTest() {
  const router = useRouter();
  const { isParentAccessValid } = useParentAccessContext();
  const [activeTab, setActiveTab] = useState("Overview");

  useFocusEffect(
    React.useCallback(() => {
      if (!isParentAccessValid()) {
        router.replace("/login/parentlogin");
      }
    }, [isParentAccessValid, router]),
  );

  return (
    <View className={["flex-1", "bg-amber-100"].join(" ")}>
      <ParentHeader />
      <ParentTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <View className={["flex-1", "p-2", "m-1"].join(" ")}>
        {activeTab === "Overview" && <OverviewTab />}
        {activeTab === "Progress" && <ProgressTab />}
        {activeTab === "Activity" && <ActivityTab />}
        {activeTab === "Settings" && <SettingsTab />}
      </View>
    </View>
  );
}
