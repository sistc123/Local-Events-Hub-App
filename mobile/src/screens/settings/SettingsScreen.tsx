import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "../../hooks/useTheme";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";

const NOTIFICATION_KEY = "notificationsEnabled";

export default function SettingsScreen() {
  const theme = useTheme();

  const mode = useThemeStore(
    (state) => state.mode
  );

  const toggleTheme = useThemeStore(
    (state) => state.toggleTheme
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  const [notificationsEnabled, setNotificationsEnabled] =
    useState(false);

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved =
        await AsyncStorage.getItem(
          NOTIFICATION_KEY
        );

      setNotificationsEnabled(
        saved === "true"
      );
    } catch (error) {
      console.log(
        "Unable to load settings:",
        error
      );
    }
  };

  const handleNotificationToggle = async (
    value: boolean
  ) => {
    try {
      setNotificationsEnabled(value);

      await AsyncStorage.setItem(
        NOTIFICATION_KEY,
        value ? "true" : "false"
      );

      if (value) {
        Alert.alert(
          "Notification Preference",
          "Notification preference enabled. Remote push notifications require the app's Development Build."
        );
      }
    } catch (error) {
      console.log(
        "Unable to save notification setting:",
        error
      );

      setNotificationsEnabled(!value);
    }
  };

  const handleLogout = () => {
    if (isLoggingOut) {
      return;
    }

    Alert.alert(
      "Log Out",
      "Are you sure you want to log out of your account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: performLogout,
        },
      ]
    );
  };

  const performLogout = async () => {
    try {
      setIsLoggingOut(true);

      await logout();

      /*
       * RootNavigator observes isAuthenticated from
       * useAuthStore and automatically switches from
       * AppNavigator to AuthNavigator.
       */
    } catch (error) {
      console.error(
        "LOGOUT ERROR:",
        error
      );

      Alert.alert(
        "Logout Failed",
        "Unable to log out. Please try again."
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[
        styles.safeArea,
        {
          backgroundColor:
            theme.colors.background,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.text,
            },
          ]}
        >
          Settings
        </Text>

        {/* Preferences */}
        <View
          style={[
            styles.card,
            {
              backgroundColor:
                theme.colors.surface,
              borderColor:
                theme.colors.border,
            },
          ]}
        >
          {/* Notifications */}

          <View style={styles.row}>
            <View style={styles.textArea}>
              <Text
                style={[
                  styles.label,
                  {
                    color:
                      theme.colors.text,
                  },
                ]}
              >
                Push Notifications
              </Text>

              <Text
                style={[
                  styles.description,
                  {
                    color:
                      theme.colors.secondaryText,
                  },
                ]}
              >
                Receive event and RSVP notifications.
              </Text>
            </View>

            <Switch
              value={notificationsEnabled}
              onValueChange={
                handleNotificationToggle
              }
              trackColor={{
                false:
                  theme.colors.border,
                true:
                  theme.colors.primary,
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View
            style={[
              styles.divider,
              {
                backgroundColor:
                  theme.colors.border,
              },
            ]}
          />

          {/* Dark Mode */}

          <View style={styles.row}>
            <View style={styles.textArea}>
              <Text
                style={[
                  styles.label,
                  {
                    color:
                      theme.colors.text,
                  },
                ]}
              >
                Dark Mode
              </Text>

              <Text
                style={[
                  styles.description,
                  {
                    color:
                      theme.colors.secondaryText,
                  },
                ]}
              >
                Use dark appearance throughout the app.
              </Text>
            </View>

            <Switch
              value={mode === "dark"}
              onValueChange={() => {
                toggleTheme();
              }}
              trackColor={{
                false:
                  theme.colors.border,
                true:
                  theme.colors.primary,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* App Features */}
        <View
          style={[
            styles.infoBox,
            {
              backgroundColor:
                theme.colors.input,
            },
          ]}
        >
          <Text
            style={[
              styles.infoTitle,
              {
                color:
                  theme.colors.text,
              },
            ]}
          >
            App Features
          </Text>

          <Text
            style={[
              styles.infoText,
              {
                color:
                  theme.colors.secondaryText,
              },
            ]}
          >
            • Dark mode and persistent theme preference{"\n"}
            • Offline event caching{"\n"}
            • Event location maps{"\n"}
            • RSVP management{"\n"}
            • Real-time comments{"\n"}
            • Notification support
          </Text>
        </View>

        {/* Logout Section */}
        <View
          style={[
            styles.logoutCard,
            {
              backgroundColor:
                theme.colors.surface,
              borderColor:
                theme.colors.border,
            },
          ]}
        >
          <View style={styles.logoutTextArea}>
            <Text
              style={[
                styles.logoutTitle,
                {
                  color: theme.colors.text,
                },
              ]}
            >
              Sign Out
            </Text>

            <Text
              style={[
                styles.logoutDescription,
                {
                  color:
                    theme.colors.secondaryText,
                },
              ]}
            >
              Sign out of your Local Events Hub account
              on this device.
            </Text>
          </View>

          <Pressable
            onPress={handleLogout}
            disabled={isLoggingOut}
            style={({ pressed }) => [
              styles.logoutButton,
              {
                borderColor:
                  theme.colors.danger,
                backgroundColor:
                  theme.colors.surface,
                opacity:
                  pressed || isLoggingOut
                    ? 0.6
                    : 1,
              },
            ]}
          >
            {isLoggingOut ? (
              <ActivityIndicator
                size="small"
                color={theme.colors.danger}
              />
            ) : (
              <Text
                style={[
                  styles.logoutButtonText,
                  {
                    color:
                      theme.colors.danger,
                  },
                ]}
              >
                Log Out
              </Text>
            )}
          </Pressable>
        </View>

        <Text
          style={[
            styles.version,
            {
              color:
                theme.colors.secondaryText,
            },
          ]}
        >
          Local Events Hub • Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 22,
  },

  card: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 18,
  },

  row: {
    minHeight: 90,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  textArea: {
    flex: 1,
    paddingRight: 20,
  },

  label: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 5,
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
  },

  divider: {
    height: 1,
  },

  infoBox: {
    marginTop: 18,
    borderRadius: 16,
    padding: 18,
  },

  infoTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
  },

  infoText: {
    fontSize: 14,
    lineHeight: 24,
  },

  logoutCard: {
    marginTop: 18,
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },

  logoutTextArea: {
    marginBottom: 16,
  },

  logoutTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 5,
  },

  logoutDescription: {
    fontSize: 14,
    lineHeight: 20,
  },

  logoutButton: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },

  logoutButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },

  version: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 20,
  },
});