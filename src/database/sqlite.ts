import * as SQLite from "expo-sqlite";

export const database = SQLite.openDatabaseSync("fable_ventures.db");

export const initializeDatabase = async () => {
  await database.execAsync("PRAGMA journal_mode = WAL;");
  await database.execAsync("PRAGMA foreign_keys = ON;");

  // Animals and achievements tables migrated to Firestore. No longer created in SQLite.
  let parentTableInit: SQLite.SQLiteStatement | null = null;
  let childTableInit: SQLite.SQLiteStatement | null = null;
  // Progress and favorite_animals tables migrated to Firestore. No longer created in SQLite.
  // child_achievements table migrated to Firestore. No longer created in SQLite.
  let storyProgressTableInit: SQLite.SQLiteStatement | null = null;
  let collectedAnimalsTableInit: SQLite.SQLiteStatement | null = null;

  try {
    // Animals and achievements tables migrated to Firestore. No longer created in SQLite.

    // Parent and child tables migrated to Firebase. No longer created in SQLite.
    // Progress and favorite_animals tables migrated to Firestore. No longer created in SQLite.

    // child_achievements table migrated to Firestore. No longer created in SQLite.

    storyProgressTableInit = await database.prepareAsync(`
      CREATE TABLE IF NOT EXISTS story_progress (
        child_id INTEGER NOT NULL,
        story_id TEXT NOT NULL,
        current_chapter_id TEXT,
        current_scene_id TEXT,
        current_node_index INTEGER DEFAULT 0,
        completed_chapters TEXT,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (child_id, story_id),
        FOREIGN KEY (child_id) REFERENCES children(child_id) ON DELETE CASCADE
      );
    `);

    collectedAnimalsTableInit = await database.prepareAsync(`
      CREATE TABLE IF NOT EXISTS collected_animals (
        child_id INTEGER NOT NULL,
        animal_id INTEGER NOT NULL,
        collected_from_story TEXT,
        collected_from_scene TEXT,
        date_collected TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (child_id, animal_id),
        FOREIGN KEY (child_id) REFERENCES children(child_id) ON DELETE CASCADE,
        FOREIGN KEY (animal_id) REFERENCES animals(animal_id) ON DELETE CASCADE
      );
    `);

    // Animals and achievements tables migrated to Firestore. No longer executed in SQLite.
    // Parent and child tables migrated to Firebase, so skip execution.
    // Progress and favorite_animals tables migrated to Firestore. No longer executed in SQLite.
    // child_achievements table migrated to Firestore. No longer executed in SQLite.
    await storyProgressTableInit.executeAsync();
    await collectedAnimalsTableInit.executeAsync();

    console.log("Database initialized successfully.");
  } finally {
    // Animals and achievements tables migrated to Firestore. No longer finalized in SQLite.
    // Parent and child tables migrated to Firebase, so skip finalize.
    // Progress and favorite_animals tables migrated to Firestore. No longer finalized in SQLite.
    // child_achievements table migrated to Firestore. No longer finalized in SQLite.
    if (storyProgressTableInit) await storyProgressTableInit.finalizeAsync();
    if (collectedAnimalsTableInit)
      await collectedAnimalsTableInit.finalizeAsync();
  }
};
