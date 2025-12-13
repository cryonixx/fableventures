import { Link } from "expo-router";
import { Text } from "react-native";

function IndexReturn() {
  return (
    <Link href="/Index">
      <Text className="font-bold text-white">← Back</Text>
    </Link>
  );
}

export default IndexReturn;
