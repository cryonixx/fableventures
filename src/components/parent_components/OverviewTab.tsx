import { ANIMALS_DATA } from "@/src/database/data/animals";
import { getCollectedAnimals } from "@/src/database/storyManager";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as Progress from "react-native-progress";
import { useParentAccessContext } from "../../context/ParentAccessContext";
import { Child, getChildrenByParentId } from "../../database/data/child";

const OverviewTab = () => {
  const [animalCount, setAnimalCount] = useState(0);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildIdx, setSelectedChildIdx] = useState(0);
  const { parentId } = useParentAccessContext();

  const totalAnimals = ANIMALS_DATA.length;

  useEffect(() => {
    if (parentId) {
      getChildrenByParentId(parentId).then(setChildren);
    } else {
      setChildren([]);
    }
  }, [parentId]);

  useEffect(() => {
    async function fetchAnimalCount() {
      try {
        const children = await getChildrenByParentId(parentId || "");
        if (children.length === 0) {
          setAnimalCount(0);
          return;
        }
        const childId = children[selectedChildIdx];
        if (!childId) {
          setAnimalCount(0);
          return;
        }

        const collected = await getCollectedAnimals(childId.child_id);
        setAnimalCount(collected.length);
      } catch (error) {
        console.error("Error fetching collected animals count:", error);
        setAnimalCount(0);
      }
    }
    fetchAnimalCount();
  }, [selectedChildIdx]);

  const selectedChild = children[selectedChildIdx];

  return (
    <ScrollView className="flex-1 rounded-lg gap-3">
      {/* Child selection buttons */}
      {children.length > 1 && (
        <View className="flex-row gap-2 mb-2">
          {children.map((child, idx) => (
            <TouchableOpacity
              key={child.child_id}
              className={`px-3 py-2 rounded-lg ${selectedChildIdx === idx ? "bg-blue-400" : "bg-gray-200"}`}
              onPress={() => setSelectedChildIdx(idx)}
            >
              <Text
                className={`font-bold ${selectedChildIdx === idx ? "text-white" : "text-black"}`}
              >
                {child.child_first_name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View className="bg-white rounded-2xl p-5 shadow-sm">
        <View className="flex-row items-center mb-4">
          <View className="w-12 h-12 bg-yellow-400 rounded-full mr-3" />
          <View>
            <Text className="text-lg font-bold">
              {selectedChild
                ? `${selectedChild.child_first_name} ${selectedChild.child_last_name}`
                : "Error fetching child"}
            </Text>
            <Text className="text-gray-400 text-sm">
              Last active: 0 hours ago
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 bg-green-50 rounded-2xl p-4 items-center">
            <Text className="text-green-600 text-3xl font-bold mb-1">
              {animalCount}
            </Text>
            <Text className="text-gray-500 text-sm">Animals</Text>
            <Text className="text-gray-500 text-sm">Collected</Text>
          </View>
          <View className="flex-1 bg-orange-50 rounded-2xl p-4 items-center">
            <Text className="text-orange-500 text-3xl font-bold mb-1">0m</Text>
            <Text className="text-gray-500 text-sm">Screen Time</Text>
            <Text className="text-gray-500 text-sm">Today</Text>
          </View>
        </View>
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 bg-white rounded-2xl p-5 shadow-sm">
          <Text className="font-bold text-gray-700 mb-1">Collection</Text>
          <Text className="font-bold text-gray-700 mb-3">Progress</Text>
          <Text className="text-gray-400 text-sm mb-2">
            {animalCount}/{totalAnimals}
          </Text>
          <Progress.Bar
            progress={animalCount / totalAnimals}
            width={null}
            height={8}
            color="#22c55e"
            unfilledColor="#e5e7eb"
            borderWidth={0}
            borderRadius={4}
          />
        </View>

        <View className="flex-1 bg-white rounded-2xl p-5 shadow-sm">
          <Text className="font-bold text-gray-700 mb-3">Learning Level</Text>
          <View className="bg-orange-400 rounded-full px-4 py-2 self-start mb-2">
            <Text className="text-white font-bold text-sm">Level 3</Text>
          </View>
          <Text className="text-4xl">🏆</Text>
        </View>
      </View>

      <View className="flex-1 bg-white rounded-2xl p-5 shadow-sm">
        <Text className="text-black font-bold text-lg mb-4">
          Favorite Animals
        </Text>
        <View className="flex-row gap-4">
          {/* TODO: Replace with actual favorite animals from Firestore for selected child */}
          <View className="items-center">
            <Text className="text-3xl mb-1">🐄</Text>
            <Text className="text-gray-600 text-sm">Cow</Text>
          </View>
          <View className="items-center">
            <Text className="text-3xl mb-1">🐷</Text>
            <Text className="text-gray-600 text-sm">Pig</Text>
          </View>
          <View className="items-center">
            <Text className="text-3xl mb-1">🐔</Text>
            <Text className="text-gray-600 text-sm">Chicken</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default OverviewTab;
