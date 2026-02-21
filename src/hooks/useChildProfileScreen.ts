import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useChildContext } from "../context/ChildContext";
import { useParentAccessContext } from "../context/ParentAccessContext";
import { getChildAchievements } from "../database/achievementsManager";
import { getChildNameById } from "../database/data/child";
import { getTestChildId } from "../database/testData";
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
        thumbnailKey: "bookcover",
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

  useFocusEffect(
    useCallback(() => {
      const fetchProfileData = async () => {
        try {
          const childId = selectedChildId || (await getTestChildId());

          const result = await getChildNameById(childId);
          if (result) {
            setChildName(`${result.firstName} ${result.lastName}`);
          } else {
            setChildName("Child not found");
          }

          // TODO: Fetch child age from Firestore if needed
          setReadingLevel("Not set");
          setReadingLevelDetail("Age data unavailable");

          const achievements = await getChildAchievements(childId);
          if (achievements.length > 0) {
            setLatestAchievement(achievements[0].title);
            setLatestAchievementDetail(
              achievements[0].description || "Achievement unlocked",
            );
            setLatestAchievementCriteria(
              achievements[0].criteria || "bookcover",
            );
          } else {
            setLatestAchievement("No achievements yet");
            setLatestAchievementDetail("Collect friends to unlock rewards");
            setLatestAchievementCriteria("bookcover");
          }

          // Fetch favorite animals from Firestore
          const favRef = collection(db, "favorite_animals");
          const favQ = query(favRef, where("child_id", "==", childId));
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
            setFavoriteAnimalDetail(
              "Tap the heart on an animal to favorite it",
            );
            setFavoriteAnimals([]);
            setFavoriteThumbnailKey("bookcover");
          }

          // Fetch recent story from Firestore
          const storyRef = collection(db, "story_progress");
          const storyQ = query(
            storyRef,
            where("child_id", "==", childId),
            orderBy("last_updated", "desc"),
            limit(1),
          );
          const storySnap = await getDocs(storyQ);
          const recentStory = storySnap.docs[0]?.data();
          if (recentStory?.story_id) {
            setRecentlyRead(getStoryTitleFromId(recentStory.story_id));
            setRecentlyReadDetail(
              recentStory.current_chapter_id
                ? formatLabel(recentStory.current_chapter_id)
                : "In progress",
            );
          } else {
            setRecentlyRead("No stories yet");
            setRecentlyReadDetail("Start a story to track progress");
          }
        } catch {
          setChildName("Error fetching name");
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
        }
      };

      fetchProfileData();
    }, [
      selectedChildId,
      formatLabel,
      getReadingLevelFromAge,
      getStoryTitleFromId,
    ]),
  );

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
    // TODO: Persist avatar selection in database
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
  };
};
