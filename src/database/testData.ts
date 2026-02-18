import { database } from "./sqlite";

export async function seedTestData() {
  try {
    // Create test parent
    const parentResult = await database.getFirstAsync(
      `SELECT parent_id FROM parents WHERE parent_email = ?`,
      ["testparent@example.com"],
    );

    let parentId: number;

    if (!parentResult) {
      // Insert test parent
      const insertParentResult = await database.runAsync(
        `INSERT INTO parents (parent_first_name, parent_last_name, parent_email, parent_passwordhash)
         VALUES (?, ?, ?, ?)`,
        [
          "Test",
          "Parent",
          "testparent@example.com",
          "hashed_password_123", // This is just a placeholder
        ],
      );
      parentId = insertParentResult.lastInsertRowId;
      console.log("Test parent created with ID:", parentId);
    } else {
      parentId = (parentResult as any).parent_id;
      console.log("Test parent already exists with ID:", parentId);
    }

    // Create test child 1
    const childResult = await database.getFirstAsync(
      `SELECT child_id FROM children WHERE child_first_name = ? AND parent_id = ?`,
      ["Red", parentId],
    );

    if (!childResult) {
      // Insert test child
      const insertChildResult = await database.runAsync(
        `INSERT INTO children (parent_id, child_first_name, child_last_name, child_age, child_gender)
         VALUES (?, ?, ?, ?, ?)`,
        [parentId, "Red", "Test", 7, "F"],
      );
      const childId = insertChildResult.lastInsertRowId;
      console.log("Test child 1 created with ID:", childId);
    } else {
      const childId = (childResult as any).child_id;
      console.log("Test child 1 already exists with ID:", childId);
    }

    // Create test child 2
    const childResult2 = await database.getFirstAsync(
      `SELECT child_id FROM children WHERE child_first_name = ? AND parent_id = ?`,
      ["Blue", parentId],
    );

    if (!childResult2) {
      // Insert second test child
      const insertChildResult2 = await database.runAsync(
        `INSERT INTO children (parent_id, child_first_name, child_last_name, child_age, child_gender)
         VALUES (?, ?, ?, ?, ?)`,
        [parentId, "Blue", "Test", 5, "M"],
      );
      const childId2 = insertChildResult2.lastInsertRowId;
      console.log("Test child 2 created with ID:", childId2);
    } else {
      const childId2 = (childResult2 as any).child_id;
      console.log("Test child 2 already exists with ID:", childId2);
    }
  } catch (error) {
    console.error("Error seeding test data:", error);
  }
}

export async function getTestChildId(): Promise<number> {
  try {
    const result = await database.getFirstAsync(
      `SELECT child_id FROM children WHERE child_first_name = ? AND child_last_name = ?`,
      ["Red", "Test"],
    );
    return (result as any)?.child_id || 1;
  } catch (error) {
    console.error("Error getting test child ID:", error);
    return 1; // Fallback to 1
  }
}

export async function getTestChildId2(): Promise<number> {
  try {
    const result = await database.getFirstAsync(
      `SELECT child_id FROM children WHERE child_first_name = ? AND child_last_name = ?`,
      ["Blue", "Test"],
    );
    return (result as any)?.child_id || 1;
  } catch (error) {
    console.error("Error getting test child 2 ID:", error);
    return 1; // Fallback to 1
  }
}

export async function resetRedTestChild(): Promise<void> {
  try {
    const childId = await getTestChildId();

    // Delete story progress
    await database.runAsync(`DELETE FROM story_progress WHERE child_id = ?`, [
      childId,
    ]);
    console.log(`Deleted story progress for child ${childId}`);

    // Delete collected animals
    await database.runAsync(
      `DELETE FROM collected_animals WHERE child_id = ?`,
      [childId],
    );
    console.log(`Deleted collected animals for child ${childId}`);

    // Delete achievements
    await database.runAsync(
      `DELETE FROM child_achievements WHERE child_id = ?`,
      [childId],
    );
    console.log(`Deleted achievements for child ${childId}`);

    console.log(`✅ Red Test child (ID: ${childId}) completely reset!`);
  } catch (error) {
    console.error("Error resetting Red Test child:", error);
  }
}
