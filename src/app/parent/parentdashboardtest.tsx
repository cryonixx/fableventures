import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import ActivityTab from "../../components/parent_components/ActivityTab";
import OverviewTab from "../../components/parent_components/OverviewTab";
import ParentHeader from "../../components/parent_components/ParentHeader";
import ParentTabBar from "../../components/parent_components/ParentTabBar";
import ProgressTab from "../../components/parent_components/ProgressTab";
import { RegisterChildModal } from "../../components/parent_components/RegisterChildModal";
import SettingsTab from "../../components/parent_components/SettingsTab";
import { useChildContext } from "../../context/ChildContext";
import { useParentAccessContext } from "../../context/ParentAccessContext";
import { auth, db } from "../../firebase";

export default function ParentDashboardTest() {
  type ChildInput = {
    firstName: string;
    lastName: string;
    age: string;
    gender: string;
  };
  const router = useRouter();
  const { isParentAccessValid } = useParentAccessContext();
  const [activeTab, setActiveTab] = useState("Overview");
  const [modalVisible, setModalVisible] = useState(false);
  const [children, setChildren] = useState<ChildInput[]>([]);
  const { setSelectedChildId } = useChildContext();

  // Fetch children from Firestore on mount
  React.useEffect(() => {
    const fetchChildren = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const childrenCol = collection(db, "children");
          const q = query(childrenCol, where("parent_id", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const loadedChildren: ChildInput[] = querySnapshot.docs.map(
            (docSnap) => {
              const data = docSnap.data();
              return {
                firstName: data.child_first_name,
                lastName: data.child_last_name,
                age: String(data.child_age),
                gender: data.child_gender,
              };
            },
          );
          setChildren(loadedChildren);
        }
      } catch (err) {
        console.error("Failed to fetch children from Firestore:", err);
      }
    };
    fetchChildren();
  }, []);

  // Save children to Firestore as individual documents
  const saveChildrenToFirestore = async (updatedChildren: ChildInput[]) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const childrenCol = collection(db, "children");
        // Remove all previous children for this parent
        const q = query(childrenCol, where("parent_id", "==", user.uid));
        const prevDocs = await getDocs(q);
        for (const docSnap of prevDocs.docs) {
          await deleteDoc(docSnap.ref);
        }
        // Add each child as a new document
        for (const child of updatedChildren) {
          await addDoc(childrenCol, {
            child_first_name: child.firstName,
            child_last_name: child.lastName,
            child_age: Number(child.age),
            child_gender: child.gender,
            parent_id: user.uid,
          });
        }
      }
    } catch (err) {
      console.error("Failed to update children in Firestore:", err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!isParentAccessValid()) {
        // Clear selected child context on parent logout/switch
        setSelectedChildId(null);
        console.warn(
          "Parent access expired or not granted. Redirecting to login.",
        );
        router.replace("/login/parentlogin");
      }
    }, [isParentAccessValid, router, setSelectedChildId]),
  );

  return (
    <View className={["flex-1", "bg-amber-100"].join(" ")}>
      <ParentHeader />
      <ParentTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <View className={["flex-1", "p-2", "m-1"].join(" ")}>
        {activeTab === "Overview" && <OverviewTab />}
        {activeTab === "Progress" && <ProgressTab />}
        {activeTab === "Activity" && <ActivityTab />}
        {activeTab === "Settings" && (
          <>
            <SettingsTab />
            <View className="mt-4">
              <ParentChildrenSection
                childrenList={children}
                onEdit={() => setModalVisible(true)}
              />
            </View>
            <RegisterChildModal
              visible={modalVisible}
              onClose={() => {
                setModalVisible(false);
                // Refresh the page to ensure children are fetched from Firestore
                router.replace("/parent/parentdashboardtest");
              }}
              initialChildren={children}
              onSave={async (childList) => {
                setChildren(childList);
                setModalVisible(false);
                // Refetch children from Firestore after save to ensure modal gets latest
                const user = auth.currentUser;
                if (user) {
                  const childrenCol = collection(db, "children");
                  const q = query(
                    childrenCol,
                    where("parent_id", "==", user.uid),
                  );
                  const querySnapshot = await getDocs(q);
                  const loadedChildren = querySnapshot.docs.map((docSnap) => {
                    const data = docSnap.data();
                    return {
                      firstName: data.child_first_name,
                      lastName: data.child_last_name,
                      age: String(data.child_age),
                      gender: data.child_gender,
                    };
                  });
                  setChildren(loadedChildren);
                }
              }}
            />
          </>
        )}
      </View>
    </View>
  );
  // Helper component to show children and edit button
  function ParentChildrenSection({
    childrenList,
    onEdit,
  }: {
    childrenList: ChildInput[];
    onEdit: () => void;
  }) {
    return (
      <View>
        <Text className="text-lg font-bold mb-2">Children</Text>
        {childrenList.length === 0 ? (
          <Text className="text-gray-500 mb-2">
            No children registered yet.
          </Text>
        ) : (
          childrenList.map((child: ChildInput, idx: number) => (
            <Text key={idx} className="mb-1">
              {child.firstName} {child.lastName}, Age: {child.age}, Gender:{" "}
              {child.gender}
            </Text>
          ))
        )}
        <Pressable
          onPress={onEdit}
          className="bg-green-500 rounded p-2 mt-2 w-32 items-center"
        >
          <Text className="text-white">
            {childrenList.length > 0 ? "Edit Children" : "Add Children"}
          </Text>
        </Pressable>
      </View>
    );
  }
}
