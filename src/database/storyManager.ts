import storyJson from "@/assets/images/script/fable_friends_script.json";
import { ChildStoryProgress, CollectedAnimal, Story } from "@/src/types/story";
import { awardAchievement } from "./achievementsManager";
import { database } from "./sqlite";

export async function loadStoryData(): Promise<Story> {
  return storyJson as Story;
}

export async function getChildProgress(
  childId: number,
  storyId: string,
): Promise<ChildStoryProgress | null> {
  try {
    const result = await database.getFirstAsync(
      `SELECT * FROM story_progress WHERE child_id = ? AND story_id = ?`,
      [childId, storyId],
    );

    if (!result) return null;

    const row = result as any;
    return {
      child_id: row.child_id,
      story_id: row.story_id,
      current_chapter_id: row.current_chapter_id || "",
      current_scene_id: row.current_scene_id || "",
      current_node_index: row.current_node_index || 0,
      completed_chapters: row.completed_chapters
        ? JSON.parse(row.completed_chapters)
        : [],
      collected_animals: [],
      last_updated: row.last_updated,
    };
  } catch (error) {
    console.error("Error fetching child progress:", error);
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
    // First verify the child exists
    const childCheck = await database.getFirstAsync(
      `SELECT child_id FROM children WHERE child_id = ?`,
      [childId],
    );

    if (!childCheck) {
      console.warn(
        `Child with ID ${childId} not found in database. Skipping progress save.`,
      );
      return;
    }

    await database.runAsync(
      `INSERT OR REPLACE INTO story_progress 
       (child_id, story_id, current_chapter_id, current_scene_id, current_node_index, completed_chapters, last_updated)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        childId,
        storyId,
        currentChapterId,
        currentSceneId,
        currentNodeIndex,
        JSON.stringify(completedChapters),
      ],
    );
  } catch (error) {
    console.warn(
      "Could not save progress:",
      error instanceof Error ? error.message : error,
    );
    // Don't throw - allow story to continue without persistence
  }
}

export async function resetChildProgress(
  childId: number,
  storyId: string,
): Promise<void> {
  try {
    await database.runAsync(
      `DELETE FROM story_progress WHERE child_id = ? AND story_id = ?`,
      [childId, storyId],
    );
    console.log(`Progress reset for child ${childId}, story ${storyId}`);
  } catch (error) {
    console.error("Error resetting progress:", error);
  }
}

export async function collectAnimal(
  childId: number,
  animalName: string,
  storyId: string,
  sceneId: string,
): Promise<void> {
  try {
    // First verify the child exists
    const childCheck = await database.getFirstAsync(
      `SELECT child_id FROM children WHERE child_id = ?`,
      [childId],
    );

    if (!childCheck) {
      console.warn(
        `Child with ID ${childId} not found in database. Skipping animal collection.`,
      );
      return;
    }

    // Get the animal_id from the animals table
    const animalResult = await database.getFirstAsync(
      `SELECT animal_id FROM animals WHERE name = ?`,
      [animalName],
    );

    if (!animalResult) {
      console.warn(`Animal "${animalName}" not found in database`);
      return;
    }

    const animalId = (animalResult as any).animal_id;

    // Check if already collected
    const existingCollection = await database.getFirstAsync(
      `SELECT child_id FROM collected_animals WHERE child_id = ? AND animal_id = ?`,
      [childId, animalId],
    );

    if (existingCollection) {
      console.log(
        `Animal "${animalName}" already collected by child ${childId}`,
      );
      return;
    }

    // Insert new collection
    await database.runAsync(
      `INSERT INTO collected_animals 
       (child_id, animal_id, collected_from_story, collected_from_scene, date_collected)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [childId, animalId, storyId, sceneId],
    );

    console.log(`Animal "${animalName}" collected for child ${childId}`);

    // Award achievement for meeting this animal
    await awardAchievement(childId, animalName);
  } catch (error) {
    console.warn(
      `Error collecting animal "${animalName}":`,
      error instanceof Error ? error.message : error,
    );
    // Don't throw - allow story to continue
  }
}

export async function getCollectedAnimals(
  childId: number,
): Promise<CollectedAnimal[]> {
  try {
    const results = await database.getAllAsync(
      `SELECT ca.child_id, a.name as animal_name, ca.collected_from_story, 
              ca.collected_from_scene, ca.date_collected
       FROM collected_animals ca
       JOIN animals a ON ca.animal_id = a.animal_id
       WHERE ca.child_id = ?
       ORDER BY ca.date_collected DESC`,
      [childId],
    );

    return (results || []).map((row: any) => ({
      child_id: row.child_id,
      animal_name: row.animal_name,
      collected_from_story: row.collected_from_story,
      collected_from_scene: row.collected_from_scene,
      date_collected: row.date_collected,
    }));
  } catch (error) {
    console.error("Error fetching collected animals:", error);
    return [];
  }
}

export async function isAnimalCollected(
  childId: number,
  animalName: string,
): Promise<boolean> {
  try {
    const result = await database.getFirstAsync(
      `SELECT ca.child_id FROM collected_animals ca
       JOIN animals a ON ca.animal_id = a.animal_id
       WHERE ca.child_id = ? AND a.name = ?`,
      [childId, animalName],
    );
    return !!result;
  } catch (error) {
    console.error("Error checking if animal is collected:", error);
    return false;
  }
}

export async function getCollectedAnimalsCount(
  childId: number,
): Promise<number> {
  try {
    const result = await database.getFirstAsync(
      `SELECT COUNT(*) as count FROM collected_animals WHERE child_id = ?`,
      [childId],
    );
    return (result as any)?.count || 0;
  } catch (error) {
    console.error("Error counting collected animals:", error);
    return 0;
  }
}
