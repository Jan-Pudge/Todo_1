import React from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation } from "convex/react";


import { TodoList } from "../../components/TodoList";
import { TodoForm } from "../../components/TodoForm";
import { Header } from "../../components/Header";
import { useTheme } from "../../context/ThemeContext";
import { api } from "../../convex/_generated/api";


export default function TodosScreen() {
  const { colors } = useTheme();

  // Реактивне отримання списку завдань
  const todos = useQuery(api.todos.getTodos);

  // Мутації
  const addTodo = useMutation(api.todos.createTodo);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <Header
        totalCount={todos?.length ?? 0}
        completedCount={todos?.filter((t) => t.isCompleted).length ?? 0}
      />

      <TodoForm
        onAdd={async (text) => {
          await addTodo({ text });
        }}
        loading={false}
      />

      {/* Обробка стану завантаження */}
      {todos === undefined ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Синхронізація з Convex...
          </Text>
        </View>
      ) : (
        <TodoList
          todos={todos}
          onToggle={async (id) => {
            await toggleTodo({ id: id as any });
          }}
          onDelete={async (id) => {
            await deleteTodo({ id: id as any });
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 14 },
});

