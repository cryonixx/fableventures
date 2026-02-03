import { router } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";

export default function ParentLogin() {
  return (
    <View className="flex-1 items-center justify-center bg-green-500">
      {/* <IndexReturn /> */}
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
          <Text className="text-center text-3xl text-green-500">
            Parent Log In
          </Text>
        </View>

        <Text
          className={["mt-4", "text-gray-950", "text-lg", "font-bold"].join(
            " ",
          )}
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
          className={["mt-4", "text-gray-950", "text-lg", "font-bold"].join(
            " ",
          )}
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
          onPress={() => router.push("/parent/parentdashboardtest")}
          className={[
            "mt-4",
            "w-full",
            "items-center",
            "rounded-3xl",
            "bg-green-500",
          ].join(" ")}
        >
          <Text className={["p-4", "font-bold", "text-white"].join(" ")}>
            Continue to Dashboard
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
