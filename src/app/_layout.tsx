import { Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../../global.css";
import { initializeDatabase } from "../database/sqlite";

export default function RootLayout() {
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        console.log("Starting database initialization...");
        await initializeDatabase();
        console.log("Database initialization completed.");
      } catch (error) {
        console.error("Database setup error:", error);
        alert(`Database setup error: ${error}`);
      }
    };
    setupDatabase();
  }, []);

  return (
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
  );
}
