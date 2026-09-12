import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { TodoItem } from "./TodoItem";

interface Todo {
  _id: string;
  text: string;
  isCompleted: boolean;
  createdAt: number;
}

interface TodoListProps {
  todos: Todo[];

  onToggle: (
    id: string,
    completed: boolean
  ) => Promise<void>;

  onDelete: (
    id: string
  ) => Promise<void>;

  onEdit?: (
    id: string,
    text: string
  ) => Promise<void>;

  refreshing?: boolean;

  onRefresh?: () => Promise<void>;
}

export function TodoList({
  todos,
  onToggle,
  onDelete,
  onEdit,
  refreshing = false,
  onRefresh,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Список завдань порожній. Додайте нове завдання вище!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={todos}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TodoItem
          todo={item}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6366f1"]}
          />
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 36,
    paddingHorizontal: 16,
  },

  emptyText: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
  },
});