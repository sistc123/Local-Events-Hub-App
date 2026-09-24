import {
  lightColors,
  darkColors,
  ThemeColors
} from "./colors";

export type ThemeMode =
  | "light"
  | "dark";

export interface AppTheme {
  mode: ThemeMode;
  colors: ThemeColors;
}

export const getTheme = (
  mode: ThemeMode
): AppTheme => {
  return {
    mode,
    colors:
      mode === "dark"
        ? darkColors
        : lightColors
  };
};