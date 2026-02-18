import { useRouter } from "expo-router";
import { Image, Pressable, View } from "react-native";
import { ChildHeader } from "../../../components/child_components/ChildHeader";
import { useCollectedAnimalsCount } from "../../../hooks/useCollectedAnimalsCount";

export default function Library() {
  const router = useRouter();
  const collectedCount = useCollectedAnimalsCount();

  return (
    <View className="flex-1 bg-amber-50">
      <ChildHeader currentprogress={collectedCount} />
      <View className="flex-1 p-8">
        <Pressable
          className="bg-white rounded-3xl p-4 shadow-lg flex-1 overflow-hidden"
          onPress={() => {
            console.log("Book Pressed");
            router.push("/child/storybook");
          }}
        >
          <Image
            source={require("../../../../assets/images/BookCover.png")}
            className="w-full h-full rounded-xl"
          />
        </Pressable>
      </View>
    </View>
  );
}
