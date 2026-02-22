import { router } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import ChildCard from "../../components/ChildCard";
import IndexReturn from "../../components/IndexReturn";
import { useChildContext } from "../../context/ChildContext";
import { useParentAccessContext } from "../../context/ParentAccessContext";
import { db } from "../../firebase";

type FirestoreChild = {
  doc_id: string;
  child_first_name: string;
  child_last_name: string;
  parent_id: string;
  avatar?: string; // Add avatar field
};

export default function ChildLogin() {
  const [children, setChildren] = useState<FirestoreChild[]>([]);
  const [selectedChildDocId, setSelectedChildDocId] = useState<string | null>(
    null,
  );
  const { setSelectedChildId: setGlobalChildId } = useChildContext();
  const { parentId } = useParentAccessContext();

  useEffect(() => {
    const loadChildren = async () => {
      if (!parentId) {
        setChildren([]);
        return;
      }
      try {
        const q = query(
          collection(db, "children"),
          where("parent_id", "==", parentId),
        );
        const querySnapshot = await getDocs(q);
        const childrenData: FirestoreChild[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          childrenData.push({
            doc_id: doc.id,
            child_first_name: data.child_first_name,
            child_last_name: data.child_last_name,
            parent_id: data.parent_id,
            avatar: data.avatar || undefined,
          });
        });
        setChildren(childrenData);
        console.log(childrenData);
      } catch (error) {
        setChildren([]);
      }
    };
    loadChildren();
  }, [parentId]);

  const handleChildSelect = (docId: string) => {
    setSelectedChildDocId(docId);
  };

  return (
    <View className="flex-1 items-center justify-center bg-green-500">
      <View className="w-full h-1/10 flex m-4">
        <IndexReturn />
      </View>
      <View
        className={[
          "h-3/5",
          "w-4/5",
          "items-start",
          "rounded-xl",
          "bg-white",
          "p-8",
          "drop-shadow-lg",
          "m-4",
        ].join(" ")}
      >
        <View className="w-full">
          <Text
            className="text-center text-xl text-green-500"
            style={{ fontFamily: "LilitaOne_400Regular" }}
          >
            Hello! Tap your name to continue your adventure!
          </Text>
        </View>

        <ScrollView
          className="mt-4 w-full flex-1 border-2 border-green-500 rounded-xl"
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: children.length === 0 ? "center" : "flex-start",
          }}
        >
          {children.length === 0 ? (
            <View
              className="w-full justify-center items-center"
              style={{ flexGrow: 1, minHeight: 200 }}
            >
              <Text
                className="text-gray-500 text-lg"
                style={{ fontFamily: "Pangolin_400Regular" }}
              >
                No children found
              </Text>
            </View>
          ) : (
            children.map((child) => {
              const childName = `${child.child_first_name} ${child.child_last_name}`;
              return (
                <ChildCard
                  key={child.doc_id}
                  name={childName}
                  onPress={() => handleChildSelect(child.doc_id)}
                  isSelected={selectedChildDocId === child.doc_id}
                />
              );
            })
          )}
        </ScrollView>

        <Pressable
          onPress={() => {
            if (!selectedChildDocId) return;
            setGlobalChildId(selectedChildDocId);
            router.push("/child/(child-tabs)/library");
          }}
          disabled={!selectedChildDocId}
          className={[
            "mt-4",
            "w-full",
            "items-center",
            "rounded-xl",
            selectedChildDocId ? "bg-yellow-500" : "bg-gray-400 opacity-50",
          ].join(" ")}
        >
          <Text
            className={["p-4", "text-white"].join(" ")}
            style={{ fontFamily: "LilitaOne_400Regular" }}
          >
            Let&apos;s go!
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
