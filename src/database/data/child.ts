import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

export interface Child {
  child_id: number;
  parent_id: number;
  child_first_name: string;
  child_last_name: string;
  child_age: number;
  child_gender: string;
}

export const getChildNameById = async (
  childDocId: string,
): Promise<{ firstName: string; lastName: string } | null> => {
  try {
    const docRef = doc(db, "children", childDocId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        firstName: data.child_first_name,
        lastName: data.child_last_name,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching child name by ID:", error);
    return null;
  }
};

export const getAllChildren = async (): Promise<Child[]> => {
  try {
    const childrenCol = collection(db, "children");
    const snapshot = await getDocs(childrenCol);
    const children: Child[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      children.push({
        child_id: Number(docSnap.id),
        parent_id: data.parent_id,
        child_first_name: data.child_first_name,
        child_last_name: data.child_last_name,
        child_age: data.child_age,
        child_gender: data.child_gender,
      });
    });
    return children;
  } catch (error) {
    console.error("Error fetching all children:", error);
    return [];
  }
};

export const getChildrenByParentId = async (
  parentId: number,
): Promise<Child[]> => {
  try {
    const childrenCol = collection(db, "children");
    const q = query(childrenCol, where("parent_id", "==", parentId));
    const snapshot = await getDocs(q);
    const children: Child[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      children.push({
        child_id: Number(docSnap.id),
        parent_id: data.parent_id,
        child_first_name: data.child_first_name,
        child_last_name: data.child_last_name,
        child_age: data.child_age,
        child_gender: data.child_gender,
      });
    });
    return children;
  } catch (error) {
    console.error("Error fetching children by parent ID:", error);
    return [];
  }
};
