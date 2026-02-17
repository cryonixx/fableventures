import { database } from "../sqlite";

export const getChildNameById = async (childId: number): Promise<{ firstName: string; lastName: string } | null> => {
  const result = await database.getAllAsync(
    "SELECT child_first_name, child_last_name FROM children WHERE child_id = ?",
    [childId]
  ) as Array<{ child_first_name: string; child_last_name: string }>;
  if (result && result.length > 0) {
    return {
      firstName: result[0].child_first_name,
      lastName: result[0].child_last_name,
    };
  }
  return null;
};
