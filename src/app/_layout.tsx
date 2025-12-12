import { Stack } from "expo-router";
import '../../global.css';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Welcome',
        }}
      />

      <Stack.Screen
        name="login/parentlogin"
        options={{
          headerShown: false,
          title: 'parentlogin',
        }}
      />
    </Stack>
  ) 
}
