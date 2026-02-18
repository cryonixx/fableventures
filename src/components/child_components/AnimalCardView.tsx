import { Image, Text, TouchableOpacity } from "react-native";
type AnimalCardProps = {
  id?: string;
  image?: string;
  name?: string;
  classification?: string;
  onPress?: () => void;
};

export default function AnimalCardView({
  image,
  name,
  onPress,
  classification,
}: AnimalCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="p-4 bg-white rounded-xl drop-shadow-lg items-center justify-center"
      style={{ width: 160, height: 160 }}
    >
      <Image
        source={
          image
            ? { uri: image }
            : require("../../../assets/images/placeholder.png")
        }
        style={{ width: 80, height: 80 }}
        resizeMode="contain"
      />
      <Text className="text-lg font-semibold mt-2" numberOfLines={1}>
        {name}
      </Text>
      <Text className="text-sm text-gray-600" numberOfLines={1}>
        {classification}
      </Text>
    </TouchableOpacity>
  );
}
