import { useState } from "react";
import { Alert } from "react-native";

type UseParentCheckOptions = {
  onVerified: () => void;
  parentPin?: string;
  maxFailedAttempts?: number;
  lockoutMs?: number;
};

export const useParentCheck = ({
  onVerified,
  parentPin = "2468",
  maxFailedAttempts = 3,
  lockoutMs = 30_000,
}: UseParentCheckOptions) => {
  const [showParentCheckModal, setShowParentCheckModal] = useState(false);
  const [parentPinInput, setParentPinInput] = useState("");
  const [failedPinAttempts, setFailedPinAttempts] = useState(0);
  const [lockUntilTimestamp, setLockUntilTimestamp] = useState<number | null>(
    null,
  );

  const openParentCheck = () => {
    if (lockUntilTimestamp && Date.now() < lockUntilTimestamp) {
      const secondsLeft = Math.ceil((lockUntilTimestamp - Date.now()) / 1000);
      Alert.alert(
        "Parent Area Locked",
        `Too many attempts. Try again in ${secondsLeft}s.`,
      );
      return;
    }

    setParentPinInput("");
    setShowParentCheckModal(true);
  };

  const closeParentCheck = () => {
    setShowParentCheckModal(false);
    setParentPinInput("");
  };

  const verifyParentPin = () => {
    if (parentPinInput.trim() === parentPin) {
      setFailedPinAttempts(0);
      closeParentCheck();
      onVerified();
      return;
    }

    const nextAttempts = failedPinAttempts + 1;
    setFailedPinAttempts(nextAttempts);

    if (nextAttempts >= maxFailedAttempts) {
      setLockUntilTimestamp(Date.now() + lockoutMs);
      closeParentCheck();
      Alert.alert("Parent Area Locked", "Try again in 30 seconds.");
      return;
    }

    Alert.alert("Incorrect PIN", "Please try again.");
  };

  return {
    showParentCheckModal,
    parentPinInput,
    setParentPinInput,
    openParentCheck,
    closeParentCheck,
    verifyParentPin,
  };
};
