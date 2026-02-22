import { useRouter } from "expo-router";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useChildContext } from "../context/ChildContext";
import { useParentAccessContext } from "../context/ParentAccessContext";
import {
  Achievement,
  getChildAchievements,
} from "../database/achievementsManager";
import { db } from "../firebase";
import { useCollectedAnimalsCount } from "./useCollectedAnimalsCount";
import { useParentCheck } from "./useParentCheck";
import { useProfileHelpers } from "./useProfileHelpers";

export type ProfileCard = {
  id: "favorite" | "achievement" | "reading" | "recent";
  title: string;
  value: string;
  detail: string;
  thumbnailKey: string;
  cardClass: string;
  textClass: string;
};

export const useChildProfileScreen = () => {
  // Helper to refresh favorites after change
  const refreshFavorites = async () => {
    if (!selectedChildId) return;
    try {
      const favRef = collection(db, "favorite_animals");
      const favQ = query(favRef, where("child_id", "==", selectedChildId));
      const favSnap = await getDocs(favQ);
      const favoriteNames = favSnap.docs.map((doc) => doc.data().animal_id);
      if (favoriteNames.length > 0) {
        const previewNames = favoriteNames.slice(0, 2).join(", ");
        const additionalCount = favoriteNames.length - 2;
        setFavoriteAnimals(favoriteNames);
        setFavoriteAnimal(
          additionalCount > 0
            ? `${previewNames} +${additionalCount}`
            : previewNames,
        );
        setFavoriteAnimalDetail(
          `${favoriteNames.length} favorite${favoriteNames.length > 1 ? "s" : ""} selected`,
        );
        setFavoriteThumbnailKey(favoriteNames[0]);
      } else {
        setFavoriteAnimal("No favorite yet");
        setFavoriteAnimalDetail("Tap the heart on an animal to favorite it");
        setFavoriteAnimals([]);
        setFavoriteThumbnailKey("bookcover");
      }
    } catch {
      setFavoriteAnimal("No favorite yet");
      setFavoriteAnimalDetail("Tap the heart on an animal to favorite it");
      setFavoriteAnimals([]);
      setFavoriteThumbnailKey("bookcover");
    }
  };
  const router = useRouter();
  const { selectedChildId } = useChildContext();
  const { grantParentAccess } = useParentAccessContext();
  const collectedCount = useCollectedAnimalsCount();

  const [childName, setChildName] = useState<string>("");
  const [avatarPickerVisible, setAvatarPickerVisible] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(
    undefined,
  );
  const [latestAchievement, setLatestAchievement] = useState(
    "No achievements yet",
  );
  const [latestAchievementDetail, setLatestAchievementDetail] = useState(
    "Collect friends to unlock rewards",
  );
  const [latestAchievementCriteria, setLatestAchievementCriteria] =
    useState<string>("bookcover");
  const [favoriteAnimal, setFavoriteAnimal] = useState("No favorite yet");
  const [favoriteAnimalDetail, setFavoriteAnimalDetail] = useState(
    "Collect an animal to set a favorite",
  );
  const [favoriteAnimals, setFavoriteAnimals] = useState<string[]>([]);
  const [favoriteThumbnailKey, setFavoriteThumbnailKey] =
    useState<string>("bookcover");
  const [readingLevel, setReadingLevel] = useState("Not set");
  const [readingLevelDetail, setReadingLevelDetail] = useState(
    "Age data unavailable",
  );
  const [recentlyRead, setRecentlyRead] = useState("No stories yet");
  const [recentlyReadDetail, setRecentlyReadDetail] = useState(
    "Start a story to track progress",
  );
  const [recentStoryId, setRecentStoryId] = useState<string | null>(null);

  const {
    formatLabel,
    getProfileThumbnail,
    getReadingLevelFromAge,
    getStoryTitleFromId,
    isStoryCompleteCriteria,
  } = useProfileHelpers();

  const {
    showParentCheckModal,
    parentPinInput,
    setParentPinInput,
    openParentCheck,
    closeParentCheck,
    verifyParentPin,
  } = useParentCheck({
    onVerified: () => {
      grantParentAccess();
      router.push("/parent/parentdashboardtest");
    },
  });

  const profileCards = useMemo<ProfileCard[]>(
    () => [
      {
        id: "favorite",
        title: "My Favorite Animals",
        value: favoriteAnimal,
        detail: favoriteAnimalDetail,
        thumbnailKey: favoriteThumbnailKey,
        cardClass: "bg-lime-100",
        textClass: "text-lime-900",
      },
      {
        id: "achievement",
        title: "My Latest Achievement",
        value: latestAchievement,
        detail: latestAchievementDetail,
        thumbnailKey: latestAchievementCriteria,
        cardClass: "bg-amber-100",
        textClass: "text-amber-900",
      },
      {
        id: "reading",
        title: "Reading Level",
        value: readingLevel,
        detail: readingLevelDetail,
        thumbnailKey: "bookcover",
        cardClass: "bg-violet-100",
        textClass: "text-violet-900",
      },
      {
        id: "recent",
        title: "Recently Read",
        value: recentlyRead,
        detail: recentlyReadDetail,
        thumbnailKey: recentStoryId ? recentStoryId : "bookcover",
        cardClass: "bg-sky-100",
        textClass: "text-sky-900",
      },
    ],
    [
      favoriteAnimal,
      favoriteAnimalDetail,
      favoriteThumbnailKey,
      latestAchievement,
      latestAchievementCriteria,
      latestAchievementDetail,
      readingLevel,
      readingLevelDetail,
      recentlyRead,
      recentlyReadDetail,
    ],
  );

  const topCards = profileCards.slice(0, 2);
  const bottomCards = profileCards.slice(2, 4);

  useEffect(() => {
    const fetchProfileData = async () => {
      const childId = selectedChildId;
      if (!childId) {
        setChildName("Child not found");
        setLatestAchievement("No achievements yet");
        setLatestAchievementDetail("Collect friends to unlock rewards");
        setLatestAchievementCriteria("bookcover");
        setFavoriteAnimal("No favorite yet");
        setFavoriteAnimalDetail("Collect an animal to set a favorite");
        setFavoriteAnimals([]);
        setFavoriteThumbnailKey("bookcover");
        setReadingLevel("Not set");
        setReadingLevelDetail("Age data unavailable");
        setRecentlyRead("No stories yet");
        setRecentlyReadDetail("Start a story to track progress");
        return;
      }

      // Get child name and avatar from Firestore
      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const childDocRef = doc(db, "children", childId);
        const childSnap = await getDoc(childDocRef);
        if (childSnap.exists()) {
          const data = childSnap.data();
          setChildName(`${data.child_first_name} ${data.child_last_name}`);
          setSelectedAvatar(data.avatar || undefined);
        } else {
          setChildName("Child not found");
          setSelectedAvatar(undefined);
        }
      } catch {
        setChildName("Child not found");
        setSelectedAvatar(undefined);
      }

      // TODO: Fetch child age from Firestore if needed
      setReadingLevel("Not set");
      setReadingLevelDetail("Age data unavailable");

      // Get achievements
      let achievements: Achievement[] = [];
      try {
        achievements = childId ? await getChildAchievements(childId) : [];
      } catch (err) {
        achievements = [];
      }
      // Sort by date_earned descending if available
      if (achievements.length > 0) {
        achievements.sort((a, b) => {
          if (a.date_earned && b.date_earned) {
            return (
              new Date(b.date_earned).getTime() -
              new Date(a.date_earned).getTime()
            );
          }
          return 0;
        });
        setLatestAchievement(achievements[0].title);
        setLatestAchievementDetail(
          achievements[0].description || "Achievement unlocked",
        );
        setLatestAchievementCriteria(achievements[0].criteria || "bookcover");
      } else {
        setLatestAchievement("No achievements yet");
        setLatestAchievementDetail("Collect friends to unlock rewards");
        setLatestAchievementCriteria("bookcover");
      }

      // Fetch favorite animals from Firestore
      let favoriteNames: string[] = [];
      try {
        const favRef = collection(db, "favorite_animals");
        const favQ = query(favRef, where("child_id", "==", childId));
        const favSnap = await getDocs(favQ);
        favoriteNames = favSnap.docs.map((doc) => doc.data().animal_id);
      } catch {
        favoriteNames = [];
      }
      if (favoriteNames.length > 0) {
        const previewNames = favoriteNames.slice(0, 2).join(", ");
        const additionalCount = favoriteNames.length - 2;
        setFavoriteAnimals(favoriteNames);
        setFavoriteAnimal(
          additionalCount > 0
            ? `${previewNames} +${additionalCount}`
            : previewNames,
        );
        setFavoriteAnimalDetail(
          `${favoriteNames.length} favorite${favoriteNames.length > 1 ? "s" : ""} selected`,
        );
        setFavoriteThumbnailKey(favoriteNames[0]);
      } else {
        setFavoriteAnimal("No favorite yet");
        setFavoriteAnimalDetail("Tap the heart on an animal to favorite it");
        setFavoriteAnimals([]);
        setFavoriteThumbnailKey("bookcover");
      }

      // Fetch recent story from Firestore
      let recentStory: any = null;
      try {
        const storyRef = collection(db, "story_progress");
        const storyQ = query(
          storyRef,
          where("child_id", "==", childId),
          orderBy("last_updated", "desc"),
          limit(1),
        );
        const storySnap = await getDocs(storyQ);
        recentStory = storySnap.docs[0]?.data();
      } catch {
        recentStory = null;
      }
      if (recentStory?.story_id) {
        setRecentlyRead(getStoryTitleFromId(recentStory.story_id));
        setRecentlyReadDetail("");
        setRecentStoryId(recentStory.story_id);
      } else {
        setRecentlyRead("No stories yet");
        setRecentlyReadDetail("Start a story to track progress");
        setRecentStoryId(null);
      }
    };

    fetchProfileData();
  }, [selectedChildId, getStoryTitleFromId, formatLabel]);

  const onCardPress = () => {};

  const onParentAreaTap = () => {
    Alert.alert(
      "Parent Check",
      "Long press this button to open parent verification.",
    );
  };

  const openAvatarPicker = () => setAvatarPickerVisible(true);
  const closeAvatarPicker = () => setAvatarPickerVisible(false);
  const handleAvatarSelect = (animal: string) => {
    setSelectedAvatar(animal);
    setAvatarPickerVisible(false);
    // Persist avatar selection in Firestore
    if (selectedChildId) {
      import("firebase/firestore").then(({ doc, updateDoc }) => {
        const childDocRef = doc(db, "children", selectedChildId);
        updateDoc(childDocRef, { avatar: animal });
      });
    }
  };

  return {
    childName,
    collectedCount,
    favoriteAnimals,
    topCards,
    bottomCards,
    getProfileThumbnail,
    isStoryCompleteCriteria,
    onCardPress,
    onParentAreaTap,
    openParentCheck,
    showParentCheckModal,
    parentPinInput,
    setParentPinInput,
    closeParentCheck,
    verifyParentPin,
    avatarPickerVisible,
    openAvatarPicker,
    closeAvatarPicker,
    handleAvatarSelect,
    selectedAvatar,
    refreshFavorites,
    recentStoryId,
  };
};
