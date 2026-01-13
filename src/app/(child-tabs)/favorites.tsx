import { Text, View } from "react-native";

export default function Favorites() {
  return (
    <View className="flex-1 items-center justify-center bg-green-500">
 
      <View
        className={[
          "h-3/5",
          "w-4/5",
          "items-start",
          "rounded-xl",
          "bg-white",
          "p-8",
          "drop-shadow-lg",
        ].join(" ")}
      >
        <Text className="text-center text-xl text-green-500">
          FAVORITES PLACEHOLDER
        </Text>
      </View>
    </View>
  );
}
