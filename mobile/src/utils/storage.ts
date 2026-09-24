import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
  async setItem(key: string, value: unknown) {
    await AsyncStorage.setItem(
      key,
      JSON.stringify(value)
    );
  },

  async getItem<T>(key: string): Promise<T | null> {
    const value = await AsyncStorage.getItem(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  },

  async removeItem(key: string) {
    await AsyncStorage.removeItem(key);
  }
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  AUTH_USER: "auth_user",
  THEME_MODE: "theme_mode",
  NOTIFICATIONS_ENABLED:
    "notifications_enabled"
} as const;