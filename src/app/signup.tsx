import { router } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";
import IndexReturn from "../components/IndexReturn";
import { useParentAccessContext } from "../context/ParentAccessContext";

export default function SignUp() {
  const { grantParentAccess } = useParentAccessContext();

  return (
    <View className="flex-1 items-center justify-center bg-green-500">
      <IndexReturn />
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
        <View className="w-full">
          <Text
            className="text-center text-3xl text-green-500"
            style={{ fontFamily: "LilitaOne_400Regular" }}
          >
            Parent Log In
          </Text>
        </View>

        <Text
          className={["mt-4", "text-gray-950", "text-lg"].join(" ")}
          style={{ fontFamily: "LilitaOne_400Regular" }}
        >
          Email
        </Text>

        <TextInput
          placeholder="email@example.com"
          className={[
            "h-10",
            "p-2",
            "w-full",
            "rounded-2xl",
            "bg-gray-200",
          ].join(" ")}
        />

        <Text
          className={["mt-4", "text-gray-950", "text-lg"].join(" ")}
          style={{ fontFamily: "LilitaOne_400Regular" }}
        >
          Password
        </Text>

        <TextInput
          placeholder="Enter your password"
          className={[
            "h-10",
            "p-2",
            "w-full",
            "rounded-2xl",
            "bg-gray-200",
          ].join(" ")}
        />
        <Pressable
          onPress={() => {
            grantParentAccess();
            router.push("/parent/parentdashboardtest");
          }}
          className={[
            "mt-4",
            "w-full",
            "items-center",
            "rounded-3xl",
            "bg-green-500",
          ].join(" ")}
        >
          <Text
            className={["p-4", "text-white"].join(" ")}
            style={{ fontFamily: "LilitaOne_400Regular" }}
          >
            Sign Up
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
