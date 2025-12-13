import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function library() {
  return (
    <View className="flex-1 items-center justify-center bg-green-500">
      <Link href="/" className="absolute left-4 top-12">
        <Text className="font-bold text-white">← Back</Text>
      </Link>
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
          LIBRARY PLACEHOLDER
        </Text>
      </View>
    </View>
  );
}
