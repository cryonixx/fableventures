// Utility to get animal info from JSON by name
// Pass animalInfo array as argument for React Native compatibility
export function getAnimalInfoByName(name: string, animalInfo: any[]) {
  if (!name || !animalInfo) return undefined;
  const normalized = name.trim().toLowerCase().replace(/\s+/g, "");
  return animalInfo.find(
    (a) =>
      a.common_name.trim().toLowerCase().replace(/\s+/g, "") === normalized,
  );
}
