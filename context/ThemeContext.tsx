import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeColors } from "../types";

const lightColors: ThemeColors = {
  bg: "#f5f7fb",
  surface: "#ffffff",
  text: "#1e293b",
  textMuted: "#94a3b8",
  border: "#e2e8f0",
  primary: "#6366f1",
  success: "#10b981",
  danger: "#ef4444",
  statusBarStyle: "dark",
};

const darkColors: ThemeColors = {
  bg: "#0f172a",
  surface: "#1e293b",
  text: "#f8fafc",
  textMuted: "#64748b",
  border: "#334155",
  primary: "#818cf8",
  success: "#34d399",
  danger: "#f87171",
  statusBarStyle: "light",
};

interface ThemeContextType {
  colors: ThemeColors;
  isDarkMode: boolean;
  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("@todo_theme_mode").then((saved) => {
      if (saved === "dark") {
        setIsDarkMode(true);
      }
    });
  }, []);

  const toggleTheme = async () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    await AsyncStorage.setItem("@todo_theme_mode", nextMode ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider
      value={{
        colors: isDarkMode ? darkColors : lightColors,
        isDarkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};