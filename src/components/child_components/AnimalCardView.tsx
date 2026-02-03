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
      className={[
        "aspect-square",
        "w-auto",
        "flex-auto",
        "m-4",
        "p-4",
        "bg-white",
        "rounded-xl",
        "drop-shadow-lg",
        "justify-around",
        "hover:scale-105",
      ].join(" ")}
    >
      <Image
        source={
          image
            ? { uri: image }
            : require("../../../assets/images/placeholder.png")
        }
        style={{ width: "50%", height: "50%" }}
      />
      <Text className="flex-2 text-xl">{name}</Text>
      <Text className="flex-2 text-md">{classification}</Text>
    </TouchableOpacity>
  );
}
