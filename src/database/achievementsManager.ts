import {
  addDoc,
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export interface Achievement {
  achievement_id: string;
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
    // Add achievements to Firestore if not already present
    const achievementsRef = collection(db, "achievements");
    const snapshot = await getDocs(achievementsRef);
    if (snapshot.empty) {
      for (const achievement of ACHIEVEMENTS) {
        await addDoc(achievementsRef, achievement);
      }
      console.log("Achievements initialized in Firestore.");
    } else {
      console.log("Achievements already exist in Firestore.");
    }
  } catch (error) {
    console.error("Error initializing achievements in Firestore:", error);
  }
}

export async function awardAchievementByCriteria(
  childDocId: string,
  criteria: string,
): Promise<void> {
  try {
    // Find achievement by criteria in Firestore
    const achievementsRef = collection(db, "achievements");
    const q = query(achievementsRef, where("criteria", "==", criteria));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      console.log(`No achievement found for criteria "${criteria}"`);
      return;
    }
    const achievementDoc = snapshot.docs[0];
    const achievementId = achievementDoc.id;

    // Check if already earned
    const childAchievementsRef = collection(db, "child_achievements");
    const checkQ = query(
      childAchievementsRef,
      where("child_id", "==", childDocId),
      where("achievement_id", "==", achievementId),
    );
    const checkSnap = await getDocs(checkQ);
    if (!checkSnap.empty) {
      console.log(
        `Achievement ${achievementId} already earned by child ${childDocId}`,
      );
      return;
    }

    // Award achievement
    await addDoc(childAchievementsRef, {
      child_id: childDocId,
      achievement_id: achievementId,
      date_earned: Timestamp.now(),
    });
    console.log(`Achievement awarded: ${achievementId} to child ${childDocId}`);
  } catch (error) {
    console.error("Error awarding achievement in Firestore:", error);
  }
}

export async function getChildAchievements(
  childDocId: string,
): Promise<Achievement[]> {
  try {
    const childAchievementsRef = collection(db, "child_achievements");
    const q = query(childAchievementsRef, where("child_id", "==", childDocId));
    const childSnap = await getDocs(q);
    const achievementsRef = collection(db, "achievements");
    const achievementsSnap = await getDocs(achievementsRef);
    const achievementsMap = new Map();
    achievementsSnap.forEach((doc) => achievementsMap.set(doc.id, doc.data()));
    const result: Achievement[] = [];
    childSnap.forEach((doc) => {
      const ach = achievementsMap.get(doc.data().achievement_id);
      if (ach) {
        result.push({
          achievement_id: doc.data().achievement_id,
          title: ach.title,
          description: ach.description,
          criteria: ach.criteria,
          date_earned: doc.data().date_earned?.toDate().toISOString(),
        });
      }
    });
    return result;
  } catch (error) {
    console.error("Error fetching child achievements from Firestore:", error);
    return [];
  }
}

export async function getAllAchievements(): Promise<Achievement[]> {
  try {
    const achievementsRef = collection(db, "achievements");
    const snapshot = await getDocs(achievementsRef);
    const results: Achievement[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      results.push({
        achievement_id: doc.id,
        title: data.title,
        description: data.description,
        criteria: data.criteria,
      });
    });
    return results;
  } catch (error) {
    console.error("Error fetching all achievements from Firestore:", error);
    return [];
  }
}
