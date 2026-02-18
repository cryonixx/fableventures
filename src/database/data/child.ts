import { database } from "../sqlite";

export interface Child {
  child_id: number;
  parent_id: number;
  child_first_name: string;
  child_last_name: string;
  child_age: number;
  child_gender: string;
}

export const getChildNameById = async (
  childId: number,
): Promise<{ firstName: string; lastName: string } | null> => {
  const result = (await database.getAllAsync(
    "SELECT child_first_name, child_last_name FROM children WHERE child_id = ?",
    [childId],
  )) as Array<{ child_first_name: string; child_last_name: string }>;
  if (result && result.length > 0) {
    return {
      firstName: result[0].child_first_name,
      lastName: result[0].child_last_name,
    };
  }
  return null;
};

export const getAllChildren = async (): Promise<Child[]> => {
  try {
    const result = (await database.getAllAsync(
      "SELECT child_id, parent_id, child_first_name, child_last_name, child_age, child_gender FROM children",
    )) as Child[];
    return result || [];
  } catch (error) {
    console.error("Error fetching all children:", error);
    return [];
  }
};

export const getChildrenByParentId = async (
  parentId: number,
): Promise<Child[]> => {
  try {
    const result = (await database.getAllAsync(
      "SELECT child_id, parent_id, child_first_name, child_last_name, child_age, child_gender FROM children WHERE parent_id = ?",
      [parentId],
    )) as Child[];
    return result || [];
  } catch (error) {
    console.error("Error fetching children by parent ID:", error);
    return [];
  }
};
