import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import AvatarPickerModal from "../../../components/child_components/AvatarPickerModal";
import { ChildHeader } from "../../../components/child_components/ChildHeader";
import ParentCheckModal from "../../../components/child_components/ParentCheckModal";
import ProfileBottomCard from "../../../components/child_components/ProfileBottomCard";
import ProfileTopCard from "../../../components/child_components/ProfileTopCard";
import { useChildProfileScreen } from "../../../hooks/useChildProfileScreen";

export default function Profile() {
  const {
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
  } = useChildProfileScreen();

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
            {selectedAvatar ? (
              <Image
                source={getProfileThumbnail(selectedAvatar)}
                style={{ width: 96, height: 96, borderRadius: 48 }}
                resizeMode="contain"
              />
            ) : (
              <MaterialIcons name="person" size={72} color="#f8fafc" />
            )}
          </Pressable>
          <Text
            className="text-2xl mb-2"
            style={{ fontFamily: "LilitaOne_400Regular" }}
          >
            {childName}
          </Text>
          <View className="mb-2 w-full gap-3 px-1">
            {topCards.map((card) => (
              <ProfileTopCard
                key={card.id}
                card={card}
                favoriteAnimals={favoriteAnimals}
                getProfileThumbnail={getProfileThumbnail}
                isStoryCompleteCriteria={isStoryCompleteCriteria}
                onPress={onCardPress}
              />
            ))}

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
        favoriteAnimals={favoriteAnimals}
        getProfileThumbnail={getProfileThumbnail}
        onSelect={handleAvatarSelect}
        onCancel={closeAvatarPicker}
      />
    </View>
  );
}
