import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { Text, View } from "react-native";

function IndexReturn() {
  return (
    <View
      className={["w-full", "p-4", "flex-row", "items-center", "gap-2"].join(
        " ",
      )}
    >
      <Ionicons name="arrow-back" size={20} color="#fff" />
      <Link href="/">
        <Text className="font-bold text-white">Back</Text>
      </Link>
    </View>
  );
}

export default IndexReturn;
