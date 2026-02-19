import { useImage } from "@/src/hooks/useImage";
import { Image, Text, TouchableOpacity } from "react-native";
type AnimalCardProps = {
  id?: string;
  name?: string;
  classification?: string;
  onPress?: () => void;
};

export default function AnimalCardView({
  name,
  onPress,
  classification,
}: AnimalCardProps) {
  const animalImage = useImage(name);
  return (
    <TouchableOpacity
      onPress={onPress}
      className="p-4 bg-white rounded-xl drop-shadow-lg items-center justify-center"
      style={{ width: 160, height: 160 }}
    >
      <Image
        source={
          animalImage
            ? animalImage
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
