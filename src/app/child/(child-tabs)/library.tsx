import { Image, Pressable, View } from "react-native";
import { ChildHeader } from "../../../components/child_components/ChildHeader";

export default function Library() {
  return (
    <View className="flex-1 bg-amber-50">
      <ChildHeader />
      <View className="flex-1 p-8">
        <Pressable
          className="bg-white rounded-3xl p-4 shadow-lg flex-1 overflow-hidden"
          onPress={() => {
            console.log("Book Pressed");
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
