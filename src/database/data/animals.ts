import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export const ANIMALS_DATA = [
  {
    name: "Red Fox",
    category: "Mammal",
    habitat: "Woods",
    description: "A clever fox with beautiful red fur and a quick spirit",
  },
  {
    name: "Turtle",
    category: "Reptile",
    habitat: "Rivers",
    description: "A thoughtful turtle who knows the wisdom of water",
  },
  {
    name: "Owl",
    category: "Bird",
    habitat: "Woods",
    description: "A wise owl that has guided many travelers",
  },
  {
    name: "Chicken",
    category: "Bird",
    habitat: "Farms",
    description: "A friendly chicken with a yellow scarf",
  },
];

export const initializeAnimals = async () => {
  const animalsRef = collection(db, "animals");
  const snapshot = await getDocs(animalsRef);
  if (snapshot.empty) {
    for (const animal of ANIMALS_DATA) {
      await addDoc(animalsRef, animal);
    }
    console.log("Animals seeded successfully in Firestore.");
  } else {
    console.log("Animals already exist in Firestore.");
  }
};

export const getAnimalCount = async (): Promise<number> => {
  const animalsRef = collection(db, "animals");
  const snapshot = await getDocs(animalsRef);
  return snapshot.size;
};
