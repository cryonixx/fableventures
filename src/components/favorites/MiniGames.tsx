import { Text, View } from "react-native";

type ContentCardProps = {
  navigateTo: (screen: string) => void;
};

export default function MiniGames({ navigateTo }: ContentCardProps) {
  return (
    <View className=" size-full m-4 p-4 bg-amber-500 rounded-lg">
      <Text>Mini Games Screen</Text>
    </View>
  );
}
