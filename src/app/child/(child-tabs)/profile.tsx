import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import AvatarPickerModal from "../../../components/child_components/AvatarPickerModal";
import { ChildHeader } from "../../../components/child_components/ChildHeader";
import ParentCheckModal from "../../../components/child_components/ParentCheckModal";
import ProfileBottomCard from "../../../components/child_components/ProfileBottomCard";
import ProfileTopCard from "../../../components/child_components/ProfileTopCard";
import RewardCard from "../../../components/child_components/RewardCard";
import {
  Achievement,
  getChildAchievements,
} from "../../../database/achievementsManager";
import { useChildProfileScreen } from "../../../hooks/useChildProfileScreen";

const ProfileInner = () => {
  const {
    childName,
    collectedCount,
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
    // favoriteAnimals,
  } = useChildProfileScreen();

  // Avatar options are unlocked achievements' criteria
  const [avatarOptions, setAvatarOptions] = useState<string[]>([]);
  const [loadingAvatars, setLoadingAvatars] = useState(true);
  const { selectedChildId } =
    require("../../../context/ChildContext").useChildContext();
  useEffect(() => {
    async function fetchAvatars() {
      setLoadingAvatars(true);
      if (!selectedChildId) {
        setAvatarOptions([]);
        setLoadingAvatars(false);
        return;
      }
      const achievements: Achievement[] =
        await getChildAchievements(selectedChildId);
      // Only use achievements with a valid criteria (animal name or story)
      setAvatarOptions(
        achievements
          .map((a) => a.criteria)
          .filter((c) => c !== "story_complete_fable_friends"),
      );
      setLoadingAvatars(false);
    }
    fetchAvatars();
  }, [selectedChildId, avatarPickerVisible]);

  return (
    <View className={["flex-1", "bg-amber-50"].join(" ")}>
      <ChildHeader currentprogress={collectedCount} />
      <ScrollView
        className={["flex-1", "w-full"].join(" ")}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className={["p-4", "items-center", "gap-4"].join(" ")}>
          <Pressable
            className="h-28 w-28 items-center justify-center rounded-full bg-yellow-400"
            onPress={openAvatarPicker}
          >
            <View className="relative w-28 h-28">
              {selectedAvatar ? (
                <Image
                  source={getProfileThumbnail(selectedAvatar)}
                  className="absolute w-24 h-24 rounded-full left-2 top-2 z-10"
                  resizeMode="contain"
                />
              ) : (
                <View className="absolute w-24 h-24 rounded-full bg-neutral-50 left-2 top-2 z-10 items-center justify-center">
                  <MaterialIcons name="person" size={72} color="#f8fafc" />
                </View>
              )}
              <Image
                source={require("../../../../assets/images/ui/frame.png")}
                className="absolute w-28 h-28 z-20"
                resizeMode="contain"
              />
            </View>
          </Pressable>
          <Text
            className="text-2xl mb-2"
            style={{ fontFamily: "LilitaOne_400Regular" }}
          >
            {childName}
          </Text>
          <View className="mb-2 w-full gap-3 px-1">
            {topCards.map((card) => {
              if (card.id === "achievement") {
                return (
                  <RewardCard
                    key={card.id}
                    name={card.value}
                    description={card.detail}
                    animalName={card.thumbnailKey}
                    isLocked={card.value === "No achievements yet"}
                  />
                );
              } else if (card.id === "favorite") {
                return (
                  <ProfileTopCard
                    key={card.id}
                    card={card}
                    favoriteAnimals={
                      require("../../../hooks/useChildProfileScreen").useChildProfileScreen()
                        .favoriteAnimals
                    }
                    getProfileThumbnail={getProfileThumbnail}
                    isStoryCompleteCriteria={isStoryCompleteCriteria}
                    onPress={onCardPress}
                  />
                );
              } else {
                return (
                  <ProfileTopCard
                    key={card.id}
                    card={card}
                    getProfileThumbnail={getProfileThumbnail}
                    isStoryCompleteCriteria={isStoryCompleteCriteria}
                    onPress={onCardPress}
                  />
                );
              }
            })}

            <View className="flex-row">
              {bottomCards.map((card, cardIndex) => (
                <ProfileBottomCard
                  key={card.id}
                  card={card}
                  cardIndex={cardIndex}
                  getProfileThumbnail={getProfileThumbnail}
                  onPress={onCardPress}
                />
              ))}
            </View>

            <View className="mt-2 rounded-2xl border border-neutral-300 bg-white/70 p-3">
              <Text
                className="text-sm text-neutral-700"
                style={{ fontFamily: "LilitaOne_400Regular" }}
              >
                Parent Area
              </Text>
              <Text
                className="mt-1 text-xs text-neutral-500"
                style={{ fontFamily: "Pangolin_400Regular" }}
              >
                Long press to switch to parent controls.
              </Text>
              <Pressable
                className="mt-3 items-center rounded-xl bg-neutral-800 px-4 py-3"
                onPress={onParentAreaTap}
                onLongPress={openParentCheck}
                delayLongPress={1500}
              >
                <Text
                  className="text-white"
                  style={{ fontFamily: "LilitaOne_400Regular" }}
                >
                  Hold to Switch to Parent
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      <ParentCheckModal
        visible={showParentCheckModal}
        pinValue={parentPinInput}
        onPinChange={setParentPinInput}
        onCancel={closeParentCheck}
        onConfirm={verifyParentPin}
      />
      <AvatarPickerModal
        visible={avatarPickerVisible}
        avatarOptions={avatarOptions}
        loadingAvatars={loadingAvatars}
        getProfileThumbnail={getProfileThumbnail}
        onSelect={handleAvatarSelect}
        onCancel={closeAvatarPicker}
      />
    </View>
  );
};

export default function Profile() {
  return <ProfileInner />;
}
