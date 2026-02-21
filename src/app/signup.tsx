import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import IndexReturn from "../components/IndexReturn";

import { RegisterChildModal } from "../components/parent_components/RegisterChildModal";
import { useChildContext } from "../context/ChildContext";
import { useParentAccessContext } from "../context/ParentAccessContext";
import { auth, db } from "../firebase";

export default function ParentSignup() {
  type ChildInput = {
    firstName: string;
    lastName: string;
    age: string;
    gender: string;
  };
  const [surname, setSurname] = useState("TestParent");
  const [children, setChildren] = useState<ChildInput[]>([]); // Array of children
  const [email, setEmail] = useState("testparent@example.com");
  const [password, setPassword] = useState("testpassword");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const { grantParentAccess } = useParentAccessContext();
  const { setSelectedChildId } = useChildContext();

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
        email,
      });
      // Add each child as a separate document in 'children' collection
      const childrenCol = collection(db, "children");
      for (const child of children) {
        await addDoc(childrenCol, {
          child_first_name: child.firstName,
          child_last_name: child.lastName,
          child_age: Number(child.age),
          child_gender: child.gender,
          parent_id: user.uid,
        });
      }
      // Set parent access context as valid
      grantParentAccess();
      // Clear any selected child context
      setSelectedChildId(null);
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
          placeholderTextColor="#888"
          style={{ fontFamily: "Pangolin_400Regular" }}
        />
        <Text
          className={["mt-4", "text-gray-950", "text-lg"].join(" ")}
          style={{ fontFamily: "LilitaOne_400Regular" }}
        >
          Children
        </Text>
        <Pressable
          onPress={() => setModalVisible(true)}
          className={[
            "h-10",
            "p-2",
            "w-full",
            "rounded-2xl",
            "bg-green-200",
            "items-center",
            "justify-center",
          ].join(" ")}
        >
          <Text
            className="text-green-700"
            style={{ fontFamily: "LilitaOne_400Regular" }}
          >
            {children.length > 0
              ? `Edit Children (${children.length})`
              : "Add Children"}
          </Text>
        </Pressable>
        <RegisterChildModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          initialChildren={children}
          onSave={(childList) => {
            setChildren([
              ...children,
              ...childList.filter(
                (c) =>
                  !children.some(
                    (existing) =>
                      existing.firstName === c.firstName &&
                      existing.lastName === c.lastName &&
                      existing.age === c.age &&
                      existing.gender === c.gender,
                  ),
              ),
            ]);
            setModalVisible(false);
          }}
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
          placeholderTextColor="#888"
          style={{ fontFamily: "Pangolin_400Regular" }}
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
          placeholderTextColor="#888"
          style={{ fontFamily: "Pangolin_400Regular" }}
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
