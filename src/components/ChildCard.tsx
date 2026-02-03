import { Image, Text, TouchableOpacity, View } from "react-native";
type RewardCardProps = {
  id?: string;
  name: string;
  image?: string;
};

function ChildCard({ name, image }: RewardCardProps) {
  return (
    <TouchableOpacity
      className={[
        "flex-row",
        "items-center",
        "bg-green-300",
        "rounded-xl",
        "p-4",
        "m-2",
        "shadow-black",
        "justify-between",
      ].join(" ")}
    >
      <View className="flex-1">
        <Text className={["text-lg", "font-bold", "mb-1"].join(" ")}>
          {name}
        </Text>
      </View>
      <Image
        source={
          image
            ? { uri: image }
            : require("../../assets/images/placeholder.png")
        }
        style={{ width: 40, height: 40 }}
      />
    </TouchableOpacity>
  );
}
export default ChildCard;
