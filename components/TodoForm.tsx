import { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

interface TodoFormProps {
  onAdd: (text: string) => Promise<void>;
  loading: boolean;
}

export function TodoForm({ onAdd, loading }: TodoFormProps) {
  const { colors } = useTheme();
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmed = text.trim();

    if (!trimmed || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onAdd(trimmed);
      setText("");
      Keyboard.dismiss();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = loading || isSubmitting || !text.trim();

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="Що потрібно зробити?"
        placeholderTextColor={colors.textMuted}
        value={text}
        onChangeText={setText}
        editable={!loading && !isSubmitting}
        maxLength={120}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />

      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: colors.primary },
          isDisabled && styles.disabledButton,
        ]}
        onPress={handleSubmit}
        disabled={isDisabled}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? "Додаємо..." : "Додати"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1.5,
    borderRadius: 10,
  },
  addButton: {
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});