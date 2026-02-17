import { database } from "../sqlite";

export const ANIMALS_DATA = [
  {
    name: "Red Fox",
    category: "Mammal",
    habitat: "Woods",
    description: "A clever fox with beautiful red fur",
  },
  {
    name: "Turtle",
    category: "Reptile",
    habitat: "Ponds",
    description: "A slow-moving turtle with a hard shell",
  },
  {
    name: "Owl",
    category: "Bird",
    habitat: "Woods",
    description: "A wise owl that hunts at night",
  },
  {
    name: "Chicken",
    category: "Bird",
    habitat: "Farms",
    description: "A friendly chicken that lays eggs",
  },
];

export const initializeAnimals = async () => {
  // Clear the animals table before seeding (development only)
  await database.runAsync('DELETE FROM animals');
  for (const animal of ANIMALS_DATA) {
    await database.runAsync(
      `INSERT INTO animals 
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
