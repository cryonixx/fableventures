import { Image, Text, TouchableOpacity, View } from "react-native";
type RewardCardProps = {
  id?: number;
  name: string;
  image?: string;
  avatar?: string;
  onPress?: () => void;
  isSelected?: boolean;
};

function ChildCard({
  name,
  image,
  avatar,
  onPress,
  isSelected,
}: RewardCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={[
        "flex-row",
        "items-center",
        isSelected ? "bg-green-500" : "bg-green-300",
        "rounded-xl",
        "p-4",
        "m-2",
        "shadow-black",
        "justify-between",
      ].join(" ")}
    >
      <View className="flex-1">
        <Text
          className={[
            "text-lg",
            "mb-1",
            isSelected ? "text-white" : "text-black",
          ].join(" ")}
          style={{ fontFamily: "LilitaOne_400Regular" }}
        >
          {name}
        </Text>
      </View>
      <Image
        source={
          avatar
            ? { uri: avatar }
            : image
              ? { uri: image }
              : require("../../assets/images/placeholder.png")
        }
        style={{ width: 40, height: 40, borderRadius: 20 }}
      />
    </TouchableOpacity>
  );
}
export default ChildCard;
