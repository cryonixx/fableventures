import { database } from "./sqlite";

export interface Achievement {
  achievement_id: number;
  title: string;
  description: string;
  criteria: string;
  date_earned?: string;
}

const ACHIEVEMENTS = [
  {
    title: "Friend of the Fox",
    description: "Met the clever Red Fox in the forest",
    criteria: "Red Fox",
  },
  {
    title: "Turtle's Wisdom",
    description: "Gained wisdom from the thoughtful Turtle",
    criteria: "Turtle",
  },
  {
    title: "Owl's Knowledge",
    description: "Learned from the wise Owl",
    criteria: "Owl",
  },
  {
    title: "Chicken's Kindness",
    description: "Befriended the friendly Chicken",
    criteria: "Chicken",
  },
  {
    title: "The tale of little red complete",
    description:
      "Completed the story! You earned this reward by finishing the tale of little red adventure.",
    criteria: "story_complete_fable_friends",
  },
];

export async function initializeAchievements() {
  try {
    // Drop and recreate achievements table to ensure correct schema
    await database.execAsync(`
      DROP TABLE IF EXISTS child_achievements;
      DROP TABLE IF EXISTS achievements;
      
      CREATE TABLE achievements (
        achievement_id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        criteria TEXT
      );
      
      CREATE TABLE child_achievements (
        child_id INTEGER NOT NULL,
        achievement_id INTEGER NOT NULL,
        date_earned TEXT,
        PRIMARY KEY (child_id, achievement_id),
        FOREIGN KEY (child_id) REFERENCES children(child_id) ON DELETE CASCADE,
        FOREIGN KEY (achievement_id) REFERENCES achievements(achievement_id) ON DELETE CASCADE
      );
    `);

    for (const achievement of ACHIEVEMENTS) {
      await database.runAsync(
        `INSERT INTO achievements (title, description, criteria) 
         VALUES (?, ?, ?)`,
        [achievement.title, achievement.description, achievement.criteria],
      );
    }
    console.log("Achievements initialized successfully.");
  } catch (error) {
    console.error("Error initializing achievements:", error);
  }
}

export async function awardAchievement(
  childId: number,
  animalName: string,
): Promise<void> {
  await awardAchievementByCriteria(childId, animalName);
}

export async function awardAchievementByCriteria(
  childId: number,
  criteria: string,
): Promise<void> {
  try {
    // Find the achievement matching this criteria
    const achievement = await database.getFirstAsync(
      `SELECT achievement_id FROM achievements WHERE criteria = ?`,
      [criteria],
    );

    if (!achievement) {
      console.log(`No achievement found for criteria "${criteria}"`);
      return;
    }

    const achievementId = (achievement as any).achievement_id;

    // Check if already earned
    const existing = await database.getFirstAsync(
      `SELECT child_id FROM child_achievements WHERE child_id = ? AND achievement_id = ?`,
      [childId, achievementId],
    );

    if (existing) {
      console.log(
        `Achievement ${achievementId} already earned by child ${childId}`,
      );
      return;
    }

    // Award the achievement (idempotent in case of duplicate/race calls)
    await database.runAsync(
      `INSERT OR IGNORE INTO child_achievements (child_id, achievement_id, date_earned)
       VALUES (?, ?, datetime('now'))`,
      [childId, achievementId],
    );

    console.log(`Achievement awarded: ${achievementId} to child ${childId}`);
  } catch (error) {
    console.error("Error awarding achievement:", error);
  }
}

export async function getChildAchievements(
  childId: number,
): Promise<Achievement[]> {
  try {
    const results = await database.getAllAsync(
      `SELECT a.achievement_id, a.title, a.description, a.criteria, ca.date_earned
       FROM achievements a
       INNER JOIN child_achievements ca ON a.achievement_id = ca.achievement_id
       WHERE ca.child_id = ?
       ORDER BY ca.date_earned DESC`,
      [childId],
    );

    return results as Achievement[];
  } catch (error) {
    console.error("Error fetching child achievements:", error);
    return [];
  }
}

export async function getAllAchievements(): Promise<Achievement[]> {
  try {
    const results = await database.getAllAsync(
      `SELECT achievement_id, title, description, criteria
       FROM achievements
       ORDER BY achievement_id ASC`,
    );

    return results as Achievement[];
  } catch (error) {
    console.error("Error fetching all achievements:", error);
    return [];
  }
}

export async function syncAchievementsForCollectedAnimals(): Promise<void> {
  try {
    // Get all collected animals and award achievements retroactively
    const collectedAnimals = await database.getAllAsync(
      `SELECT DISTINCT ca.child_id, a.name
       FROM collected_animals ca
       INNER JOIN animals a ON ca.animal_id = a.animal_id`,
    );

    for (const record of collectedAnimals as any[]) {
      await awardAchievement(record.child_id, record.name);
    }

    console.log("Synced achievements for all collected animals");
  } catch (error) {
    console.error("Error syncing achievements:", error);
  }
}
