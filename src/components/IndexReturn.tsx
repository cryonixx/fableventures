import { Link } from "expo-router";
import { Text } from "react-native";

function IndexReturn() {
  return (
    <Link href="/" className="absolute left-4 top-12">
      <Text className="font-bold text-white">← Back</Text>
    </Link>
  );
}

export default IndexReturn;
