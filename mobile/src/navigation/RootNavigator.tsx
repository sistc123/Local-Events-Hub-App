import React, { useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";

import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { useTheme } from "../hooks/useTheme";

const RootNavigator = () => {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const authLoading = useAuthStore(
    (state) => state.isLoading
  );

  const checkAuth = useAuthStore(
    (state) => state.checkAuth
  );

  const loadTheme = useThemeStore(
    (state) => state.loadTheme
  );

  const { theme, isLoading: themeLoading } = useTheme();

  useEffect(() => {
    checkAuth();
    loadTheme();
  }, [checkAuth, loadTheme]);

  /*
   * Safety fallback.
   * This prevents:
   *
   * Cannot read property 'colors' of undefined
   *
   * even while the theme is being initialized.
   */
  if (
    authLoading ||
    themeLoading ||
    !theme ||
    !theme.colors
  ) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer
      theme={{
        dark: theme.mode === "dark",
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: theme.colors.primary,
        },
        fonts: {
          regular: {
            fontFamily: "System",
            fontWeight: "400",
          },
          medium: {
            fontFamily: "System",
            fontWeight: "500",
          },
          bold: {
            fontFamily: "System",
            fontWeight: "700",
          },
          heavy: {
            fontFamily: "System",
            fontWeight: "800",
          },
        },
      }}
    >
      {isAuthenticated ? (
        <AppNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
});

export default RootNavigator;