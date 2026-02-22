import { Modal, Pressable, Text, TextInput, View } from "react-native";

type ParentCheckModalProps = {
  visible: boolean;
  pinValue: string;
  onPinChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ParentCheckModal({
  visible,
  pinValue,
  onPinChange,
  onCancel,
  onConfirm,
}: ParentCheckModalProps) {
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
            Parent Check
          </Text>
          <Text
            className="mt-2 text-sm text-neutral-600"
            style={{ fontFamily: "Pangolin_400Regular" }}
          >
            Enter parent PIN to continue.
          </Text>

          <TextInput
            value={pinValue}
            onChangeText={onPinChange}
            placeholder="4-digit PIN"
            keyboardType="number-pad"
            maxLength={6}
            secureTextEntry
            className="mt-4 rounded-xl bg-neutral-100 px-4 py-3 text-base"
          />

          <View className="mt-4 flex-row">
            <Pressable
              className="mr-2 flex-1 items-center rounded-xl bg-neutral-200 py-3"
              onPress={onCancel}
            >
              <Text style={{ fontFamily: "LilitaOne_400Regular" }}>Cancel</Text>
            </Pressable>
            <Pressable
              className="ml-2 flex-1 items-center rounded-xl bg-green-500 py-3"
              onPress={onConfirm}
            >
              <Text
                className="text-white"
                style={{ fontFamily: "LilitaOne_400Regular" }}
              >
                Continue
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
