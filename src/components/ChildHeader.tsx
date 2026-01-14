import { Text, View } from "react-native";
import * as Progress from "react-native-progress";

type ChildHeaderProps = {
  title?: string;
  subtitle?: string;
  currentprogress?: number;
  totalprogress?: number;
};

export function ChildHeader({
  title = "Fable Friends",
  currentprogress = 1, //placeholder value
  totalprogress = 4, //placeholder value
}: ChildHeaderProps) {
  const progressValue = totalprogress > 0 ? currentprogress / totalprogress : 0;

  return (
    <View className="w-full rounded-b-2xl bg-green-400 p-4 pb-6 drop-shadow-lg">
      <Text className="mt-8 mb-2 text-2xl text-white font-bold">{title}</Text>
      <View className="rounded-xl h-auto w-auto bg-white p-4 drop-shadow-md">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="items-center py-1 text-lg text-neutral-600 mb-2">
            Collection Progress
          </Text>
          <View className="bg-orange-400 rounded-full px-4 py-1">
            <Text className="text-white font-bold text-sm">
              {currentprogress}/{totalprogress}
            </Text>
          </View>
        </View>
        <Progress.Bar
          className="mb-4"
          progress={progressValue}
          width={null}
          color="#16a34a"
          unfilledColor="#f3f4f6"
          borderWidth={0}
        />
        <Text className="text-sm text-neutral-400">
          {totalprogress} more friends to discover!
        </Text>
      </View>
    </View>
  );
}
