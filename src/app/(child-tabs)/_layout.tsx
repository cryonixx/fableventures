import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ headerShown:false, title: 'Home' }} />
      <Tabs.Screen name="library" options={{ headerShown:false, title: 'Library' }} />
      <Tabs.Screen name="rewards" options={{ headerShown:false, title: 'Rewards' }} />
      <Tabs.Screen name="favorites" options={{ headerShown:false, title: 'Favorites' }} />
      <Tabs.Screen name="profile" options={{ headerShown:false, title: 'Profile' }} />
    </Tabs>
  );
}
