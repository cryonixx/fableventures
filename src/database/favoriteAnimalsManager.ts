import {
    addDoc,
    collection,
    deleteDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { db } from "../firebase";

// AnimalIdRow type removed: not used in Firestore context

async function getAnimalIdByName(animalName: string): Promise<string> {
  // In Firestore, animalName is used as unique identifier
  // Return animalName directly
  return animalName;
}

export async function isFavoriteAnimal(
  childId: number,
  animalName: string,
): Promise<boolean> {
  try {
    const animalId = await getAnimalIdByName(animalName);
    const favRef = collection(db, "favorite_animals");
    const q = query(
      favRef,
      where("child_id", "==", childId),
      where("animal_id", "==", animalId),
    );
    const snap = await getDocs(q);
    return !snap.empty;
  } catch (error) {
    console.error("Error checking favorite animal in Firestore:", error);
    return false;
  }
}

export async function setFavoriteAnimal(
  childId: number,
  animalName: string,
): Promise<boolean> {
  try {
    const animalId = await getAnimalIdByName(animalName);
    const favRef = collection(db, "favorite_animals");
    await addDoc(favRef, {
      child_id: childId,
      animal_id: animalId,
    });
    return true;
  } catch (error) {
    console.error("Error setting favorite animal in Firestore:", error);
    return false;
  }
}

export async function removeFavoriteAnimal(
  childId: number,
  animalName: string,
): Promise<boolean> {
  try {
    const animalId = await getAnimalIdByName(animalName);
    const favRef = collection(db, "favorite_animals");
    const q = query(
      favRef,
      where("child_id", "==", childId),
      where("animal_id", "==", animalId),
    );
    const snap = await getDocs(q);
    for (const docSnap of snap.docs) {
      await deleteDoc(docSnap.ref);
    }
    return true;
  } catch (error) {
    console.error("Error removing favorite animal in Firestore:", error);
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
