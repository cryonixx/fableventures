import IndexReturn from "@/src/components/IndexReturn";
import { auth } from "@/src/firebase";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function ParentLogin() {
  const [email, setEmail] = useState("testparent@example.com");
  const [password, setPassword] = useState("testpassword");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/parent/parentdashboardtest");
    } catch (err: any) {
      setError(err?.message || "An error occurred during login.");
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 items-center justify-center bg-green-500">
      <IndexReturn />
      <View
        className={[
          "h-2/5",
          "w-4/5",
          "items-start",
          "rounded-xl",
          "bg-white",
          "p-8",
          "m-4",
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
          value={email}
          onChangeText={setEmail}
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
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className={[
            "h-10",
            "p-2",
            "w-full",
            "rounded-2xl",
            "bg-gray-200",
          ].join(" ")}
        />
        <Pressable
          onPress={handleLogin}
          disabled={loading}
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
            Continue to Dashboard
          </Text>
        </Pressable>
        {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      </View>
    </View>
  );
}
