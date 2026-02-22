import {
    addDoc,
    collection,
    deleteDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import React, { useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { auth, db } from "../../firebase";

interface ChildInput {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
}

interface RegisterChildModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (children: ChildInput[]) => void;
  initialChildren?: ChildInput[];
}

export function RegisterChildModal({
  visible,
  onClose,
  onSave,
  initialChildren = [],
}: RegisterChildModalProps) {
  const [children, setChildren] = useState<ChildInput[]>(initialChildren);
  const [currentChild, setCurrentChild] = useState<ChildInput>({
    firstName: "Test",
    lastName: "Child",
    age: "5",
    gender: "M",
  });
  const [existingChildIds, setExistingChildIds] = useState<string[]>([]);

  const handleAddChild = () => {
    if (
      !currentChild.firstName ||
      !currentChild.lastName ||
      !currentChild.age ||
      !currentChild.gender
    )
      return;
    setChildren([...children, currentChild]);
    setCurrentChild({ firstName: "", lastName: "", age: "", gender: "" });
  };

  const handleRemoveChild = (index: number) => {
    setChildren(children.filter((_, i) => i !== index));
  };

  // Fetch all child document IDs for this parent when modal opens
  React.useEffect(() => {
    const fetchChildIds = async () => {
      if (!visible) return;
      const user = auth.currentUser;
      if (user) {
        const childrenCol = collection(db, "children");
        const q = query(childrenCol, where("parent_id", "==", user.uid));
        const prevDocs = await getDocs(q);
        const ids = prevDocs.docs.map((docSnap) => docSnap.id);
        setExistingChildIds(ids);
      }
    };
    fetchChildIds();
  }, [visible]);

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const childrenCol = collection(db, "children");
        // Fetch previous children for this parent
        const q = query(childrenCol, where("parent_id", "==", user.uid));
        const prevDocs = await getDocs(q);
        const prevIds = prevDocs.docs.map((docSnap) => docSnap.id);

        // Determine which children are being kept
        const newChildrenNames = children.map(
          (c) => `${c.firstName}|${c.lastName}|${c.age}|${c.gender}`,
        );
        const keptIds: string[] = [];
        prevDocs.docs.forEach((docSnap) => {
          const data = docSnap.data();
          const key = `${data.child_first_name}|${data.child_last_name}|${data.child_age}|${data.child_gender}`;
          if (newChildrenNames.includes(key)) {
            keptIds.push(docSnap.id);
          }
        });

        // Determine which child IDs are being deleted
        const deletedIds = prevIds.filter((id) => !keptIds.includes(id));

        // Cascade delete related tables for deleted child IDs
        for (const childId of deletedIds) {
          // Delete from child_achievements
          const achCol = collection(db, "child_achievements");
          const achQ = query(achCol, where("child_id", "==", childId));
          const achSnap = await getDocs(achQ);
          for (const docSnap of achSnap.docs) {
            await deleteDoc(docSnap.ref);
          }
          // Delete from collected_animals
          const caCol = collection(db, "collected_animals");
          const caQ = query(caCol, where("child_id", "==", childId));
          const caSnap = await getDocs(caQ);
          for (const docSnap of caSnap.docs) {
            await deleteDoc(docSnap.ref);
          }
          // Delete from favorite_animals
          const faCol = collection(db, "favorite_animals");
          const faQ = query(faCol, where("child_id", "==", childId));
          const faSnap = await getDocs(faQ);
          for (const docSnap of faSnap.docs) {
            await deleteDoc(docSnap.ref);
          }
          // Delete from story_progress
          const spCol = collection(db, "story_progress");
          const spQ = query(spCol, where("child_id", "==", childId));
          const spSnap = await getDocs(spQ);
          for (const docSnap of spSnap.docs) {
            await deleteDoc(docSnap.ref);
          }
        }

        // Delete all previous children for this parent
        for (const docSnap of prevDocs.docs) {
          await deleteDoc(docSnap.ref);
        }
        // Add all new children
        for (const child of children) {
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
    if (children.length > 0) {
      onSave(children);
      setChildren(initialChildren);
      setCurrentChild({ firstName: "", lastName: "", age: "", gender: "" });
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="bg-white rounded-xl p-6 w-11/12 max-w-lg">
          <Text
            className="text-2xl text-green-700 mb-4"
            style={{ fontFamily: "LilitaOne_400Regular" }}
          >
            Register Children
          </Text>
          <TextInput
            placeholder="First Name"
            value={currentChild.firstName}
            onChangeText={(text) =>
              setCurrentChild({ ...currentChild, firstName: text })
            }
            className="mb-2 p-2 bg-gray-100 rounded-xl"
            placeholderTextColor="#888"
            style={{ fontFamily: "Pangolin_400Regular" }}
          />
          <TextInput
            placeholder="Last Name"
            value={currentChild.lastName}
            onChangeText={(text) =>
              setCurrentChild({ ...currentChild, lastName: text })
            }
            className="mb-2 p-2 bg-gray-100 rounded-xl"
            placeholderTextColor="#888"
            style={{ fontFamily: "Pangolin_400Regular" }}
          />
          <TextInput
            placeholder="Age"
            value={currentChild.age}
            onChangeText={(text) =>
              setCurrentChild({ ...currentChild, age: text })
            }
            keyboardType="numeric"
            className="mb-2 p-2 bg-gray-100 rounded-xl"
            placeholderTextColor="#888"
            style={{ fontFamily: "Pangolin_400Regular" }}
          />
          <TextInput
            placeholder="Gender"
            value={currentChild.gender}
            onChangeText={(text) =>
              setCurrentChild({ ...currentChild, gender: text })
            }
            className="mb-4 p-2 bg-gray-100 rounded-xl"
            placeholderTextColor="#888"
            style={{ fontFamily: "Pangolin_400Regular" }}
          />
          <Pressable
            onPress={handleAddChild}
            className="bg-green-500 rounded-xl py-3 px-4 mb-4 items-center"
          >
            <Text
              className="text-white text-base"
              style={{ fontFamily: "LilitaOne_400Regular" }}
            >
              Add Child
            </Text>
          </Pressable>
          <FlatList
            data={children}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item, index }) => (
              <View className="flex-row justify-between items-center mb-2">
                <Text>{`${item.firstName} ${item.lastName}, Age: ${item.age}, Gender: ${item.gender}`}</Text>
                <Pressable
                  onPress={() => handleRemoveChild(index)}
                  className="ml-2 bg-red-400 rounded-xl px-2 py-1"
                >
                  <Text
                    className="text-white"
                    style={{ fontFamily: "LilitaOne_400Regular" }}
                  >
                    Remove
                  </Text>
                </Pressable>
              </View>
            )}
            ListEmptyComponent={
              <Text
                className="text-gray-500"
                style={{ fontFamily: "Pangolin_400Regular" }}
              >
                No children added yet.
              </Text>
            }
          />
          <View className="flex-row justify-end mt-4">
            <Pressable onPress={onClose} className="mr-4 p-2 rounded-xl">
              <Text
                className="text-green-700"
                style={{ fontFamily: "LilitaOne_400Regular" }}
              >
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              className="bg-green-500 rounded-xl p-2"
            >
              <Text
                className="text-white"
                style={{ fontFamily: "LilitaOne_400Regular" }}
              >
                Save
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
