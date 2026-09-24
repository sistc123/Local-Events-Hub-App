import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { ThemeMode } from "../theme/colors";
import { AppTheme, getTheme } from "../theme/theme";

interface ThemeState {
  mode: ThemeMode;
  theme: AppTheme;
  isLoading: boolean;

  setMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  loadTheme: () => Promise<void>;
}

const THEME_STORAGE_KEY = "theme_mode";

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: "light",
  theme: getTheme("light"),
  isLoading: true,

  setMode: async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);

      set({
        mode,
        theme: getTheme(mode),
      });
    } catch (error) {
      console.error("Failed to save theme:", error);

      set({
        mode,
        theme: getTheme(mode),
      });
    }
  },

  toggleTheme: async () => {
    const currentMode = get().mode;
    const newMode: ThemeMode =
      currentMode === "light" ? "dark" : "light";

    await get().setMode(newMode);
  },

  loadTheme: async () => {
    try {
      const savedMode = await AsyncStorage.getItem(
        THEME_STORAGE_KEY
      );

      const mode: ThemeMode =
        savedMode === "dark" ? "dark" : "light";

      set({
        mode,
        theme: getTheme(mode),
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load theme:", error);

      set({
        mode: "light",
        theme: getTheme("light"),
        isLoading: false,
      });
    }
  },
}));