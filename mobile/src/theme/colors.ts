export const lightColors = {
  primary: "#2563EB",
  secondary: "#7C3AED",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  text: "#111827",
  secondaryText: "#6B7280",
  border: "#E5E7EB",
  danger: "#DC2626",
  success: "#16A34A",
  input: "#F1F5F9",
};

export const darkColors = {
  primary: "#60A5FA",
  secondary: "#A78BFA",
  background: "#0F172A",
  surface: "#1E293B",
  text: "#F8FAFC",
  secondaryText: "#CBD5E1",
  border: "#334155",
  danger: "#F87171",
  success: "#4ADE80",
  input: "#334155",
};

export type ThemeColors = typeof lightColors;

export type ThemeMode = "light" | "dark";