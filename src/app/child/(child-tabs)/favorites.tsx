import AnimalCardView from "@/src/components/child_components/AnimalCardView";
import { database } from "@/src/database/sqlite";
import { getCollectedAnimals } from "@/src/database/storyManager";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { ChildHeader } from "../../../components/child_components/ChildHeader";
import { useChildContext } from "../../../context/ChildContext";
import { useCollectedAnimalsCount } from "../../../hooks/useCollectedAnimalsCount";

interface AnimalCard {
  id: string;
  name: string;
  classification: string;
}

export default function Favorites() {
  const router = useRouter();
  const [animals, setAnimals] = useState<AnimalCard[]>([]);
  const [loading, setLoading] = useState(true);
  const collectedCount = useCollectedAnimalsCount();
  const { selectedChildId } = useChildContext();

  // Use useFocusEffect to refetch when tab comes into focus
  useFocusEffect(
    useCallback(() => {
      const loadCollectedAnimals = async () => {
        try {
          // Use selected child ID from context, fallback to test child
          const currentChildId = selectedChildId;

          if (!currentChildId) {
            setAnimals([]);
            setLoading(false);
            return;
          }

          const collected = await getCollectedAnimals(currentChildId);

          // Get animal details from database
          const animalCards: AnimalCard[] = [];
          for (const animal of collected) {
            const animalResult = await database.getFirstAsync(
              `SELECT animal_id, name, category FROM animals WHERE name = ?`,
              [animal.animal_name],
            );

            if (animalResult) {
              const row = animalResult as any;
              animalCards.push({
                id: row.animal_id.toString(),
                name: row.name,
                classification: row.category,
              });
            }
          }

          setAnimals(animalCards);
        } catch (error) {
          console.error("Error loading collected animals:", error);
        } finally {
          setLoading(false);
        }
      };

      loadCollectedAnimals();
    }, [selectedChildId]),
  );

  if (loading) {
    return (
      <View className="flex-1 bg-amber-50 justify-center items-center">
        <Text className="text-lg" style={{ fontFamily: "Pangolin_400Regular" }}>
          Loading your collection...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-amber-50">
      <ChildHeader currentprogress={collectedCount} />
      {animals.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg font-semibold text-gray-600">
            No animals collected yet!
          </Text>
          <Text
            className="text-base text-gray-500 mt-2"
            style={{ fontFamily: "Pangolin_400Regular" }}
          >
            Complete stories to collect animals
          </Text>
        </View>
      ) : (
        <FlatList
          data={animals}
          numColumns={2}
          renderItem={({ item }) => (
            <AnimalCardView
              onPress={() =>
                router.push({
                  pathname: "/child/animaldetail",
                  params: {
                    id: item.id,
                    name: item.name,
                    classification: item.classification,
                  },
                })
              }
              name={item.name}
              classification={item.classification}
            />
          )}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={{
            justifyContent: "center",
            gap: 16,
            marginBottom: 16,
          }}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
        />
      )}
    </View>
  );
}
