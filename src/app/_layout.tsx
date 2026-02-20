import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";
import { Pangolin_400Regular } from "@expo-google-fonts/pangolin";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../../global.css";
import { ChildProvider } from "../context/ChildContext";
import { ParentAccessProvider } from "../context/ParentAccessContext";
import {
  initializeAchievements,
  syncAchievementsForCollectedAnimals,
} from "../database/achievementsManager";
import { initializeAnimals } from "../database/data/animals";
import { initializeDatabase } from "../database/sqlite";
import { resetRedTestChild, seedTestData } from "../database/testData";

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    LilitaOne_400Regular,
    Pangolin_400Regular,
  });

  useEffect(() => {
    if (!fontsLoaded || fontError) return;

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = [
      { fontFamily: "Pangolin_400Regular" },
      Text.defaultProps.style,
    ];

    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.style = [
      { fontFamily: "Pangolin_400Regular" },
      TextInput.defaultProps.style,
    ];
  }, [fontsLoaded]);

  useEffect(() => {
    // Hide navigation bar on Android
    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("hidden");
    }

    const setup = async () => {
      try {
        console.log("Starting database initialization...");
        await initializeDatabase();
        console.log("Database initialization completed.");
      } catch (error) {
        console.error("Database setup error:", error);
        alert(`Database setup error: ${error}`);
      }
      try {
        console.log("Starting animals initialization...");
        await initializeAnimals();
        console.log("Animals initialization completed.");
      } catch (error) {
        console.error("Animals setup error:", error);
        alert(`Animals setup error: ${error}`);
      }
      try {
        console.log("Starting achievements initialization...");
        await initializeAchievements();
        console.log("Achievements initialization completed.");
      } catch (error) {
        console.error("Achievements setup error:", error);
      }
      try {
        console.log("Starting test data seeding...");
        await seedTestData();
        console.log("Test data seeding completed.");
      } catch (error) {
        console.error("Test data seeding error:", error);
      }
      try {
        console.log("Syncing achievements for collected animals...");
        await syncAchievementsForCollectedAnimals();
        console.log("Achievement sync completed.");
      } catch (error) {
        console.error("Achievement sync error:", error);
      }
      try {
        console.log("Resetting Red Test child...");
        await resetRedTestChild();
        console.log("Red Test child reset completed.");
      } catch (error) {
        console.error("Reset error:", error);
      }
    };
    setup();
  }, []);

  if (!fontsLoaded && !fontError) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <ParentAccessProvider>
      <ChildProvider>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="index"
              options={{
                title: "Welcome",
              }}
            />
            <Stack.Screen
              name="login/parentlogin"
              options={{
                title: "parentlogin",
              }}
            />
            <Stack.Screen
              name="login/childlogin"
              options={{
                title: "childlogin",
              }}
            />
            <Stack.Screen
              name="child/(child-tabs)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="parentdashboardtest"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </SafeAreaProvider>
      </ChildProvider>
    </ParentAccessProvider>
  );
}
