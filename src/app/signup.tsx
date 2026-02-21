import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import IndexReturn from "../components/IndexReturn";
import { auth, db } from "../firebase";

export default function ParentSignup() {
  const [surname, setSurname] = useState("TestParent");
  const [childName, setChildName] = useState("TestChild");
  const [email, setEmail] = useState("testparent@example.com");
  const [password, setPassword] = useState("testpassword");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      await setDoc(doc(db, "parents", user.uid), {
        surname,
        childName,
        email,
      });
      router.push("/parent/parentdashboardtest");
    } catch (err: any) {
      setError(err.message);
      console.error("Error during sign up:", err);
    }
    setLoading(false);
  };

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
            Parent Sign Up
          </Text>
        </View>
        <Text
          className={["mt-4", "text-gray-950", "text-lg"].join(" ")}
          style={{ fontFamily: "LilitaOne_400Regular" }}
        >
          Parent Surname
        </Text>
        <TextInput
          placeholder="Enter surname"
          value={surname}
          onChangeText={setSurname}
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
          Child's Full Name
        </Text>
        <TextInput
          placeholder="Enter child's full name"
          value={childName}
          onChangeText={setChildName}
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
          onPress={handleSignup}
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
            Sign Up
          </Text>
        </Pressable>
        {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      </View>
    </View>
  );
}
