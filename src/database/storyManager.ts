import storyJson from "@/assets/script/fable_friends_script.json";
import { ChildStoryProgress, CollectedAnimal, Story } from "@/src/types/story";
import { awardAchievement } from "./achievementsManager";

export async function loadStoryData(): Promise<Story> {
  return storyJson as Story;
}

export async function getChildProgress(
  childId: number,
  storyId: string,
): Promise<ChildStoryProgress | null> {
  try {
    // Firestore migration
    const { collection, query, where, getDocs } =
      await import("firebase/firestore");
    const { db } = await import("../firebase");
    const progressRef = collection(db, "story_progress");
    const q = query(
      progressRef,
      where("child_id", "==", childId),
      where("story_id", "==", storyId),
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const row = snap.docs[0].data();
    return {
      child_id: row.child_id,
      story_id: row.story_id,
      current_chapter_id: row.current_chapter_id || "",
      current_scene_id: row.current_scene_id || "",
      current_node_index: row.current_node_index || 0,
      completed_chapters: row.completed_chapters || [],
      collected_animals: row.collected_animals || [],
      last_updated: row.last_updated,
    };
  } catch (error) {
    console.error("Error fetching child progress from Firestore:", error);
    return null;
  }
}

export async function saveChildProgress(
  childId: number,
  storyId: string,
  currentChapterId: string,
  currentSceneId: string,
  currentNodeIndex: number = 0,
  completedChapters: string[] = [],
): Promise<void> {
  try {
    // Firestore migration
    const { collection, query, where, getDocs, setDoc, doc, Timestamp } =
      await import("firebase/firestore");
    const { db } = await import("../firebase");
    const progressRef = collection(db, "story_progress");
    const q = query(
      progressRef,
      where("child_id", "==", childId),
      where("story_id", "==", storyId),
    );
    const snap = await getDocs(q);
    let docId = snap.empty ? undefined : snap.docs[0].id;
    const progressDoc = docId
      ? doc(db, "story_progress", docId)
      : doc(progressRef);
    await setDoc(progressDoc, {
      child_id: childId,
      story_id: storyId,
      current_chapter_id: currentChapterId,
      current_scene_id: currentSceneId,
      current_node_index: currentNodeIndex,
      completed_chapters: completedChapters,
      last_updated: Timestamp ? Timestamp.now() : new Date().toISOString(),
    });
  } catch (error) {
    console.warn(
      "Could not save progress to Firestore:",
      error instanceof Error ? error.message : error,
    );
  }
}

export async function resetChildProgress(
  childId: number,
  storyId: string,
): Promise<void> {
  try {
    // Firestore migration
    const { collection, query, where, getDocs, deleteDoc } =
      await import("firebase/firestore");
    const { db } = await import("../firebase");
    const progressRef = collection(db, "story_progress");
    const q = query(
      progressRef,
      where("child_id", "==", childId),
      where("story_id", "==", storyId),
    );
    const snap = await getDocs(q);
    for (const docSnap of snap.docs) {
      await deleteDoc(docSnap.ref);
    }
    console.log(
      `Progress reset for child ${childId}, story ${storyId} in Firestore`,
    );
  } catch (error) {
    console.error("Error resetting progress in Firestore:", error);
  }
}

export async function collectAnimal(
  childId: number,
  animalName: string,
  storyId: string,
  sceneId: string,
): Promise<void> {
  try {
    // Firestore migration
    const { collection, query, where, getDocs, addDoc } =
      await import("firebase/firestore");
    const { db } = await import("../firebase");
    const collectedRef = collection(db, "collected_animals");
    const q = query(
      collectedRef,
      where("child_id", "==", childId),
      where("animal_name", "==", animalName),
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      console.log(
        `Animal "${animalName}" already collected by child ${childId}`,
      );
      return;
    }
    await addDoc(collectedRef, {
      child_id: childId,
      animal_name: animalName,
      collected_from_story: storyId,
      collected_from_scene: sceneId,
      date_collected: new Date().toISOString(),
    });
    console.log(
      `Animal "${animalName}" collected for child ${childId} in Firestore`,
    );
    await awardAchievement(childId, animalName);
  } catch (error) {
    console.warn(
      `Error collecting animal "${animalName}" in Firestore:`,
      error instanceof Error ? error.message : error,
    );
    // Don't throw - allow story to continue
  }
}

export async function getCollectedAnimals(
  childId: number,
): Promise<CollectedAnimal[]> {
  try {
    // Firestore migration
    const { collection, query, where, getDocs } =
      await import("firebase/firestore");
    const { db } = await import("../firebase");
    const collectedRef = collection(db, "collected_animals");
    const q = query(collectedRef, where("child_id", "==", childId));
    const snap = await getDocs(q);
    return snap.docs.map((doc) => {
      const data = doc.data();
      return {
        child_id: data.child_id,
        animal_name: data.animal_name,
        collected_from_story: data.collected_from_story,
        collected_from_scene: data.collected_from_scene,
        date_collected: data.date_collected,
      } as CollectedAnimal;
    });
  } catch (error) {
    console.error("Error fetching collected animals from Firestore:", error);
    return [];
  }
}

export async function isAnimalCollected(
  childId: number,
  animalName: string,
): Promise<boolean> {
  try {
    // Firestore migration
    const { collection, query, where, getDocs } =
      await import("firebase/firestore");
    const { db } = await import("../firebase");
    const collectedRef = collection(db, "collected_animals");
    const q = query(
      collectedRef,
      where("child_id", "==", childId),
      where("animal_name", "==", animalName),
    );
    const snap = await getDocs(q);
    return !snap.empty;
  } catch (error) {
    console.error("Error checking if animal is collected in Firestore:", error);
    return false;
  }
}

export async function getCollectedAnimalsCount(
  childId: number,
): Promise<number> {
  try {
    // Firestore migration
    const { collection, query, where, getDocs } =
      await import("firebase/firestore");
    const { db } = await import("../firebase");
    const collectedRef = collection(db, "collected_animals");
    const q = query(collectedRef, where("child_id", "==", childId));
    const snap = await getDocs(q);
    return snap.size;
  } catch (error) {
    console.error("Error counting collected animals in Firestore:", error);
    return 0;
  }
}
