import { Link } from "expo-router";
import { Text, View } from "react-native";

function IndexReturn() {
  return (
    <View className="w-full p-4 border">
      <Link href="/">
        <Text className="font-bold text-white">Back</Text>
      </Link>
    </View>
  );
}

export default IndexReturn;
