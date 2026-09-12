import { StyleSheet, Text, View } from "react-native";

interface HeaderProps {
  totalCount: number;
  completedCount: number;
}

export function Header({ totalCount, completedCount }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleGroup}>
        <Text style={styles.icon}>📝</Text>

        <Text style={styles.title}>Мій Список Завдань</Text>
      </View>

      <Text style={styles.subtitle}>
        {totalCount > 0
          ? `Виконано ${completedCount} з ${totalCount} завдань`
          : "Додайте своє перше завдання"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    alignItems: "center",
  },

  titleGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 6,
  },

  icon: {
    fontSize: 32,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1e293b",
  },

  subtitle: {
    color: "#64748b",
    fontSize: 15,
    fontWeight: "400",
  },
});