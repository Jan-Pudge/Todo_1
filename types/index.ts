export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt?: number;
}

export interface ThemeColors {
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  success: string;
  danger: string;
  statusBarStyle: "light" | "dark";
}