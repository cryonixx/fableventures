import { database } from "./sqlite";

type AnimalIdRow = { animal_id: number } | null;

async function getAnimalIdByName(animalName: string): Promise<number | null> {
  const result = (await database.getFirstAsync(
    "SELECT animal_id FROM animals WHERE name = ?",
    [animalName],
  )) as AnimalIdRow;

  return result?.animal_id ?? null;
}

export async function isFavoriteAnimal(
  childId: number,
  animalName: string,
): Promise<boolean> {
  try {
    const animalId = await getAnimalIdByName(animalName);
    if (!animalId) return false;

    const result = await database.getFirstAsync(
      `SELECT 1
       FROM favorite_animals
       WHERE child_id = ? AND animal_id = ?`,
      [childId, animalId],
    );

    return !!result;
  } catch (error) {
    console.error("Error checking favorite animal:", error);
    return false;
  }
}

export async function setFavoriteAnimal(
  childId: number,
  animalName: string,
): Promise<boolean> {
  try {
    const animalId = await getAnimalIdByName(animalName);
    if (!animalId) return false;

    await database.runAsync(
      "INSERT OR IGNORE INTO favorite_animals (child_id, animal_id) VALUES (?, ?)",
      [childId, animalId],
    );

    return true;
  } catch (error) {
    console.error("Error setting favorite animal:", error);
    return false;
  }
}

export async function removeFavoriteAnimal(
  childId: number,
  animalName: string,
): Promise<boolean> {
  try {
    const animalId = await getAnimalIdByName(animalName);
    if (!animalId) return false;

    await database.runAsync(
      "DELETE FROM favorite_animals WHERE child_id = ? AND animal_id = ?",
      [childId, animalId],
    );

    return true;
  } catch (error) {
    console.error("Error removing favorite animal:", error);
    return false;
  }
}

export async function toggleFavoriteAnimal(
  childId: number,
  animalName: string,
): Promise<boolean> {
  const alreadyFavorite = await isFavoriteAnimal(childId, animalName);

  if (alreadyFavorite) {
    await removeFavoriteAnimal(childId, animalName);
    return false;
  }

  await setFavoriteAnimal(childId, animalName);
  return true;
}
