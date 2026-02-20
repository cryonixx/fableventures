import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function index() {
  return (
    <View className="flex-1 items-center justify-center bg-green-500">
      <View
        className={[
          "h-32",
          "w-32",
          "items-center",
          "rounded-3xl",
          "bg-white",
          "p-4",
          "drop-shadow-lg",
        ].join(" ")}
      >
        <Ionicons name="home" size={64} color="#D32F2F" />
      </View>
      <Text
        className={["m-4", "text-center", "text-4xl", "text-white"].join(" ")}
        style={{ fontFamily: "LilitaOne_400Regular" }}
      >
        Welcome to the Farm!
      </Text>
      <Text
        className={[
          "m-2",
          "mb-10",
          "text-center",
          "text-md",
          "text-white",
        ].join(" ")}
        style={{ fontFamily: "Pangolin_400Regular" }}
      >
        Choose how you'd like to explore.
      </Text>

      <Pressable
        onPress={() => router.push("/login/parentlogin")}
        className={[
          "mt-4",
          "w-4/5",
          "items-center",
          "rounded-xl",
          "bg-white",
          "drop-shadow-lg",
        ].join(" ")}
      >
        <Text
          className={["p-4", "text-green-500"].join(" ")}
          style={{ fontFamily: "LilitaOne_400Regular" }}
        >
          Log In as Parent
        </Text>
      </Pressable>
      <Pressable
        onPress={() => router.push("/login/childlogin")}
        className={[
          "mt-4",
          "w-4/5",
          "items-center",
          "rounded-xl",
          "bg-yellow-400",
          "drop-shadow-lg",
        ].join(" ")}
      >
        <Text
          className={["p-4", "text-white"].join(" ")}
          style={{ fontFamily: "LilitaOne_400Regular" }}
        >
          Log In as Child
        </Text>
      </Pressable>
      <Link
        href="/signup"
        className={[
          "mt-6",
          "w-4/5",
          "items-center",
          "rounded-xl",
          "drop-shadow-lg",
        ].join(" ")}
      >
        <Text
          className={["p-4", "text-white"].join(" ")}
          style={{ fontFamily: "LilitaOne_400Regular" }}
        >
          Don't have an account? Sign Up
        </Text>
      </Link>
    </View>
  );
}
