import React from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";

interface AvatarPickerModalProps {
  visible: boolean;
  favoriteAnimals: string[];
  getProfileThumbnail: (name: string) => any;
  onSelect: (animal: string) => void;
  onCancel: () => void;
}

const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  visible,
  favoriteAnimals,
  getProfileThumbnail,
  onSelect,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 items-center justify-center bg-black/40 px-6">
        <View className="w-full max-w-sm rounded-2xl bg-white p-5">
          <Text
            className="text-lg text-neutral-800"
            style={{ fontFamily: "LilitaOne_400Regular" }}
          >
            Choose Profile Picture
          </Text>
          <Text
            className="mt-2 text-sm text-neutral-600"
            style={{ fontFamily: "Pangolin_400Regular" }}
          >
            Tap a favorite animal to set as your profile picture.
          </Text>
          <View className="mt-4 flex-row flex-wrap gap-3 justify-center">
            {favoriteAnimals.length === 0 ? (
              <Text className="text-neutral-500">No favorite animals yet.</Text>
            ) : (
              favoriteAnimals.map((animal) => (
                <Pressable
                  key={animal}
                  className="items-center justify-center rounded-xl border border-lime-400 bg-lime-50 p-2"
                  onPress={() => onSelect(animal)}
                >
                  <Image
                    source={getProfileThumbnail(animal)}
                    style={{ width: 48, height: 48, borderRadius: 12 }}
                    resizeMode="contain"
                  />
                  <Text
                    className="mt-1 text-xs text-lime-900"
                    style={{ fontFamily: "Pangolin_400Regular" }}
                  >
                    {animal}
                  </Text>
                </Pressable>
              ))
            )}
          </View>
          <View className="mt-4 flex-row">
            <Pressable
              className="mr-2 flex-1 items-center rounded-xl bg-neutral-200 py-3"
              onPress={onCancel}
            >
              <Text style={{ fontFamily: "LilitaOne_400Regular" }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AvatarPickerModal;
