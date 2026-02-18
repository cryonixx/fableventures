import { database } from "../sqlite";

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
  for (const animal of ANIMALS_DATA) {
    await database.runAsync(
      `INSERT OR IGNORE INTO animals 
       (name, category, habitat, description) 
       VALUES (?, ?, ?, ?)`,
      [animal.name, animal.category, animal.habitat, animal.description],
    );
  }
  console.log("Animals seeded successfully.");
};

export const getAnimalCount = async (): Promise<number> => {
  const result = await database.getAllAsync(
    "SELECT COUNT(*) as count FROM animals",
  );
  if (result && result.length > 0) {
    return (result[0] as { count: number }).count;
  }
  return 0;
};
