import { Image, Text, View } from "react-native";
type RewardCardProps = {
  name: string;
  description: string;
  image?: string;
};

export default function RewardCard({
  name,
  description,
  image,
}: RewardCardProps) {
  return (
    <View
      className={[
        "flex-row",
        "items-center",
        "bg-white",
        "rounded-xl",
        "p-4",
        "m-2",
        "drop-shadow-lg",
        "justify-between",
      ].join(" ")}
    >
      <View className="flex-1">
        <Text className={["text-lg", "font-bold", "mb-1"].join(" ")}>
          {name}
        </Text>
        <Text className={["text-sm", "text-gray-500", "mb-1"].join(" ")}>
          {description}
        </Text>
      </View>
      <Image
        source={
          image
            ? { uri: image }
            : require("../../../assets/images/placeholder.png")
        }
        style={{ width: 64, height: 64 }}
      />
    </View>
  );
}
