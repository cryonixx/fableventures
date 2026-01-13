import { Stack } from "expo-router";
import "../../global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Welcome",
        }}
      />
      <Stack.Screen
        name="login/ParentLogin"
        options={{
          title: "parentlogin",
        }}
      />
      <Stack.Screen
        name="login/ChildLogin"
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
  );
}
