import React from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useTheme } from "../../context/ThemeContext";
import { api } from "../../convex/_generated/api";




export default function StatsScreen() {
  const { colors } = useTheme();

  // Реактивна статистика з Convex
  const stats = useQuery(api.todos.getStats);

  if (stats === undefined) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>📊 Статистика</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Аналітика завдань у реальному часі
        </Text>

        <View style={styles.grid}>
          {/* Картка 1: Всього */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="list" size={28} color={colors.primary} />
            <Text style={[styles.cardValue, { color: colors.text }]}>{stats.total}</Text>
            <Text style={[styles.cardLabel, { color: colors.textMuted }]}>Всього завдань</Text>
          </View>

          {/* Картка 2: Активні */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="time" size={28} color="#F59E0B" />
            <Text style={[styles.cardValue, { color: colors.text }]}>{stats.active}</Text>
            <Text style={[styles.cardLabel, { color: colors.textMuted }]}>В процесі</Text>
          </View>

          {/* Картка 3: Виконані */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="checkmark-done-circle" size={28} color={colors.success} />
            <Text style={[styles.cardValue, { color: colors.text }]}>{stats.completed}</Text>
            <Text style={[styles.cardLabel, { color: colors.textMuted }]}>Виконано</Text>
          </View>

          {/* Картка 4: Відсоток */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="trending-up" size={28} color="#8B5CF6" />
            <Text style={[styles.cardValue, { color: colors.text }]}>{stats.percentage}%</Text>
            <Text style={[styles.cardLabel, { color: colors.textMuted }]}>Прогрес</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold" },
  subtitle: { fontSize: 14, marginTop: 4, marginBottom: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: {
    width: "48%",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    gap: 6,
  },
  cardValue: { fontSize: 24, fontWeight: "bold" },
  cardLabel: { fontSize: 13 },
});