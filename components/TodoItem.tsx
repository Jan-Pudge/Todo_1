import { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useTheme } from "../context/ThemeContext";

interface Todo {
  _id: string;
  text: string;
  isCompleted: boolean;
  createdAt: number;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit?: (id: string, text: string) => Promise<void>;
}

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
}: TodoItemProps) {
  const { colors } = useTheme();

  const updateTodo = useMutation(api.todos.updateTodo);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    const trimmed = editText.trim();

    if (!trimmed) {
      setEditText(todo.text);
      setIsEditing(false);
      Keyboard.dismiss();
      return;
    }

    if (trimmed === todo.text) {
      setIsEditing(false);
      Keyboard.dismiss();
      return;
    }

    try {
      setIsUpdating(true);

      if (onEdit) {
        await onEdit(todo._id, trimmed);
      } else {
        await updateTodo({
          id: todo._id as any,
          text: trimmed,
        });
      }
    } finally {
      setIsUpdating(false);
      setIsEditing(false);
      Keyboard.dismiss();
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
    Keyboard.dismiss();
  };

  const handleToggle = async () => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);

      await onToggle(
        todo._id,
        !todo.isCompleted
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);

      await onDelete(todo._id);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        isUpdating && styles.updating,
      ]}
    >
      <TouchableOpacity
        style={[
          styles.checkbox,
          {
            borderColor: colors.border,
            backgroundColor: colors.surface,
          },
          todo.isCompleted && {
            backgroundColor: colors.success,
            borderColor: colors.success,
          },
        ]}
        onPress={handleToggle}
        disabled={isUpdating}
        activeOpacity={0.7}
      >
        {todo.isCompleted && (
          <Ionicons
            name="checkmark"
            size={14}
            color="#ffffff"
          />
        )}
      </TouchableOpacity>

      {isEditing ? (
        <TextInput
          style={[
            styles.editInput,
            {
              color: colors.text,
              borderColor: colors.primary,
              backgroundColor: colors.bg,
            },
          ]}
          value={editText}
          onChangeText={setEditText}
          maxLength={120}
          autoFocus
          editable={!isUpdating}
          returnKeyType="done"
          onSubmitEditing={handleSave}
        />
      ) : (
        <TouchableOpacity
          style={styles.textContainer}
          onLongPress={() => {
            if (!isUpdating) {
              setEditText(todo.text);
              setIsEditing(true);
            }
          }}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.text,
              { color: colors.text },
              todo.isCompleted && {
                color: colors.textMuted,
                textDecorationLine: "line-through",
              },
            ]}
          >
            {todo.text}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.actions}>
        {isEditing ? (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSave}
              disabled={isUpdating}
            >
              <Ionicons
                name="checkmark"
                size={18}
                color={colors.success}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleCancel}
              disabled={isUpdating}
            >
              <Ionicons
                name="close"
                size={18}
                color={colors.danger}
              />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              if (!isUpdating) {
                setEditText(todo.text);
                setIsEditing(true);
              }
            }}
            disabled={isUpdating}
          >
            <Ionicons
              name="pencil-outline"
              size={18}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDelete}
          disabled={isUpdating}
        >
          <Ionicons
            name="trash-outline"
            size={18}
            color={colors.danger}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    gap: 12,
    marginBottom: 8,
  },

  updating: {
    opacity: 0.6,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  textContainer: {
    flex: 1,
  },

  text: {
    fontSize: 16,
  },

  editInput: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 16,
    borderWidth: 1.5,
    borderRadius: 6,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  actionButton: {
    padding: 6,
    borderRadius: 6,
  },
});