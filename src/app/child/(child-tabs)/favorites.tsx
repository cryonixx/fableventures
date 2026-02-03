import AnimalCardView from "@/src/components/child_components/AnimalCardView";
import { useRouter } from "expo-router";
import { FlatList, View } from "react-native";
import { ChildHeader } from "../../../components/child_components/ChildHeader";

const test = [
  {
    id: "1",
    image: "../assets/lion.png",
    name: "Lion",
    classification: "Mammal",
  },
  {
    id: "2",
    image: "../assets/eagle.png",
    name: "Eagle",
    classification: "Bird",
  },
  {
    id: "3",
    image: "../assets/shark.png",
    name: "Shark",
    classification: "Fish",
  },
  {
    id: "4",
    image: "../assets/frog.png",
    name: "Frog",
    classification: "Amphibian",
  },
  {
    id: "5",
    image: "../assets/crocodile.png",
    name: "Crocodile",
    classification: "Reptile",
  },
  {
    id: "6",
    image: "../assets/elephant.png",
    name: "Elephant",
    classification: "Mammal",
  },
  {
    id: "7",
    image: "../assets/penguin.png",
    name: "Penguin",
    classification: "Bird",
  },
  {
    id: "8",
    image: "../assets/salmon.png",
    name: "Salmon",
    classification: "Fish",
  },
  {
    id: "9",
    image: "../assets/toad.png",
    name: "Toad",
    classification: "Amphibian",
  },
  {
    id: "10",
    image: "../assets/lizard.png",
    name: "Lizard",
    classification: "Reptile",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-amber-50">
      <ChildHeader />
      <FlatList
        data={test}
        numColumns={2}
        renderItem={({ item }) => (
          <AnimalCardView
            onPress={() =>
              router.push({
                pathname: "../animaldetail",
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
      />
    </View>
  );
}
