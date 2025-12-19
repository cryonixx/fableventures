import { Link } from "expo-router";
import { Text } from "react-native";

function IndexReturn() {
  return (
    <Link href="/">
      <Text className="font-bold text-white m-8">← Back</Text>
    </Link>
  );
}

export default IndexReturn;
