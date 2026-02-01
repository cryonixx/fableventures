import * as SQLite from "expo-sqlite";

export const database = SQLite.openDatabaseSync("fable_ventures.db");

export const initializeDatabase = async () => {
  await database.execAsync("PRAGMA journal_mode = WAL;");
  await database.execAsync("PRAGMA foreign_keys = ON;");

  let animalsTableInit: SQLite.SQLiteStatement | null = null;
  let achievementsTableInit: SQLite.SQLiteStatement | null = null;
  let parentTableInit: SQLite.SQLiteStatement | null = null;
  let childTableInit: SQLite.SQLiteStatement | null = null;
  let progressTableInit: SQLite.SQLiteStatement | null = null;
  let favoriteAnimalsTableInit: SQLite.SQLiteStatement | null = null;
  let childAchievementsTableInit: SQLite.SQLiteStatement | null = null;

  try {
    animalsTableInit = await database.prepareAsync(`
      CREATE TABLE IF NOT EXISTS animals (
        animal_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT,
        habitat TEXT,
        description TEXT,
        image_url TEXT
      );
    `);

    achievementsTableInit = await database.prepareAsync(`
      CREATE TABLE IF NOT EXISTS achievements (
        achievement_id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        criteria INTEGER
      );
    `);

    parentTableInit = await database.prepareAsync(`
      CREATE TABLE IF NOT EXISTS parents (
        parent_id INTEGER PRIMARY KEY AUTOINCREMENT,
        parent_first_name TEXT,
        parent_last_name TEXT,
        parent_email TEXT UNIQUE NOT NULL,
        parent_passwordhash TEXT NOT NULL
      );
    `);

    childTableInit = await database.prepareAsync(`
      CREATE TABLE IF NOT EXISTS children (
        child_id INTEGER PRIMARY KEY AUTOINCREMENT,
        parent_id INTEGER NOT NULL,
        child_first_name TEXT,
        child_last_name TEXT,
        child_age INTEGER,
        child_gender TEXT CHECK(child_gender IN ('M', 'F')),
        FOREIGN KEY (parent_id) REFERENCES parents(parent_id) ON DELETE CASCADE
      );
    `);
    progressTableInit = await database.prepareAsync(`
      CREATE TABLE IF NOT EXISTS progress (
        child_id INTEGER NOT NULL,
        animal_id INTEGER NOT NULL,
        total_collected INTEGER DEFAULT 0,
        total_screen_time INTEGER DEFAULT 0,
        PRIMARY KEY (child_id, animal_id),
        FOREIGN KEY (child_id) REFERENCES children(child_id) ON DELETE CASCADE,
        FOREIGN KEY (animal_id) REFERENCES animals(animal_id) ON DELETE CASCADE
      );
    `);

    favoriteAnimalsTableInit = await database.prepareAsync(`
      CREATE TABLE IF NOT EXISTS favorite_animals (
        child_id INTEGER NOT NULL,
        animal_id INTEGER NOT NULL,
        PRIMARY KEY (child_id, animal_id),
        FOREIGN KEY (child_id) REFERENCES children(child_id) ON DELETE CASCADE,
        FOREIGN KEY (animal_id) REFERENCES animals(animal_id) ON DELETE CASCADE
      );
    `);

    childAchievementsTableInit = await database.prepareAsync(`
      CREATE TABLE IF NOT EXISTS child_achievements (
        child_id INTEGER NOT NULL,
        achievement_id INTEGER NOT NULL,
        date_earned TEXT,
        PRIMARY KEY (child_id, achievement_id),
        FOREIGN KEY (child_id) REFERENCES children(child_id) ON DELETE CASCADE,
        FOREIGN KEY (achievement_id) REFERENCES achievements(achievement_id) ON DELETE CASCADE
      );
    `);

    await animalsTableInit.executeAsync();
    await achievementsTableInit.executeAsync();
    await parentTableInit.executeAsync();
    await childTableInit.executeAsync();
    await favoriteAnimalsTableInit.executeAsync();
    await childAchievementsTableInit.executeAsync();

    console.log("Database initialized successfully.");
  } finally {
    if (animalsTableInit) await animalsTableInit.finalizeAsync();
    if (achievementsTableInit) await achievementsTableInit.finalizeAsync();
    if (parentTableInit) await parentTableInit.finalizeAsync();
    if (childTableInit) await childTableInit.finalizeAsync();
    if (favoriteAnimalsTableInit)
      await favoriteAnimalsTableInit.finalizeAsync();
    if (childAchievementsTableInit)
      await childAchievementsTableInit.finalizeAsync();
  }
};
