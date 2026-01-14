import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../../global.css";

export default function RootLayout() {
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
          name="(child-tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
