import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useAuthStore } from "../../store/authStore";
import { useTheme } from "../../hooks/useTheme";
import api from "../../services/api";

const ProfileScreen = ({ navigation }: any) => {
  const { user, updateUser } = useAuthStore();
  const { colors } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
  }, [user?.name]);

  const initials = (user?.name || "User")
    .trim()
    .split(/\s+/)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .slice(0, 2)
    .join("");

  const handleCancel = () => {
    setName(user?.name || "");
    setIsEditing(false);
  };

  const handleSave = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      Alert.alert(
        "Invalid name",
        "Please enter your full name."
      );
      return;
    }

    if (trimmedName.length < 2) {
      Alert.alert(
        "Invalid name",
        "Name must contain at least 2 characters."
      );
      return;
    }

    if (!user) {
      Alert.alert(
        "Error",
        "User information is unavailable."
      );
      return;
    }

    try {
      setSaving(true);

      console.log(
        "UPDATING PROFILE:",
        trimmedName
      );

      const response = await api.put(
        "/users/profile",
        {
          name: trimmedName,
        }
      );

      console.log(
        "PROFILE UPDATE RESPONSE:",
        response.data
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to update profile."
        );
      }

      /*
       * IMPORTANT:
       *
       * Do NOT call checkAuth() here.
       *
       * checkAuth() re-reads authentication state
       * and can cause the application to think that
       * the user is logged out.
       *
       * We only update the user's profile information.
       * The existing JWT remains untouched.
       */

      const updatedUser = {
        ...user,
        name: trimmedName,
      };

      updateUser(updatedUser);

      setName(trimmedName);
      setIsEditing(false);

      Alert.alert(
        "Profile Updated",
        "Your profile has been updated successfully."
      );
    } catch (error: any) {
      console.error(
        "UPDATE PROFILE ERROR:",
        error?.response?.data || error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to update your profile. Please try again.";

      Alert.alert(
        "Update Failed",
        message
      );
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={[
          styles.loadingContainer,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text
          style={[
            styles.loadingText,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          Loading profile...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}

          <View style={styles.header}>
            <Text
              style={[
                styles.headerTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              My Profile
            </Text>

            <Pressable
              style={[
                styles.settingsButton,
                {
                  backgroundColor:
                    colors.surface,
                  borderColor:
                    colors.border,
                },
              ]}
              onPress={() =>
                navigation.navigate("Settings")
              }
            >
              <Ionicons
                name="settings-outline"
                size={23}
                color={colors.text}
              />
            </Pressable>
          </View>

          {/* PROFILE IDENTITY */}

          <View style={styles.profileHeader}>
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor:
                    colors.primary,
                },
              ]}
            >
              <Text style={styles.avatarText}>
                {initials}
              </Text>
            </View>

            <Text
              style={[
                styles.profileName,
                {
                  color: colors.text,
                },
              ]}
            >
              {user.name}
            </Text>

            <Text
              style={[
                styles.profileEmail,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              {user.email}
            </Text>
          </View>

          {/* PROFILE CARD */}

          <View
            style={[
              styles.card,
              {
                backgroundColor:
                  colors.surface,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {isEditing
                  ? "Edit Profile"
                  : "Profile Information"}
              </Text>
            </View>

            {/* NAME */}

            <View style={styles.fieldContainer}>
              <Text
                style={[
                  styles.label,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Full Name
              </Text>

              {isEditing ? (
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor={
                    colors.secondaryText
                  }
                  autoCapitalize="words"
                  returnKeyType="done"
                  editable={!saving}
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      backgroundColor:
                        colors.input,
                      borderColor:
                        colors.border,
                    },
                  ]}
                />
              ) : (
                <Text
                  style={[
                    styles.value,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {user.name}
                </Text>
              )}
            </View>

            {/* EMAIL */}

            <View style={styles.fieldContainer}>
              <Text
                style={[
                  styles.label,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Email Address
              </Text>

              <Text
                style={[
                  styles.value,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {user.email}
              </Text>

              {isEditing && (
                <Text
                  style={[
                    styles.helperText,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  Email address cannot be changed here.
                </Text>
              )}
            </View>
          </View>

          {/* ACTIONS */}

          {!isEditing ? (
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor:
                    colors.primary,
                  opacity:
                    pressed ? 0.85 : 1,
                },
              ]}
              onPress={() =>
                setIsEditing(true)
              }
            >
              <Ionicons
                name="create-outline"
                size={20}
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.primaryButtonText
                }
              >
                Edit Profile
              </Text>
            </Pressable>
          ) : (
            <View style={styles.editActions}>
              {/* CANCEL */}

              <Pressable
                style={({ pressed }) => [
                  styles.secondaryButton,
                  {
                    borderColor:
                      colors.border,
                    backgroundColor:
                      colors.surface,
                    opacity:
                      pressed ? 0.8 : 1,
                  },
                ]}
                onPress={handleCancel}
                disabled={saving}
              >
                <Text
                  style={[
                    styles.secondaryButtonText,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Cancel
                </Text>
              </Pressable>

              {/* SAVE */}

              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  styles.saveButton,
                  {
                    backgroundColor:
                      colors.primary,
                    opacity:
                      pressed || saving
                        ? 0.75
                        : 1,
                  },
                ]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />
                ) : (
                  <>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color="#FFFFFF"
                    />

                    <Text
                      style={
                        styles.primaryButtonText
                      }
                    >
                      Save Changes
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          )}

          {/* ACCOUNT SECTION */}

          <View
            style={[
              styles.accountCard,
              {
                backgroundColor:
                  colors.surface,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.accountTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Account
            </Text>

            <Pressable
              style={styles.accountRow}
              onPress={() =>
                navigation.navigate("Settings")
              }
            >
              <View style={styles.accountRowContent}>
                <View
                  style={[
                    styles.accountIcon,
                    {
                      backgroundColor:
                        colors.input,
                    },
                  ]}
                >
                  <Ionicons
                    name="settings-outline"
                    size={20}
                    color={colors.primary}
                  />
                </View>

                <View>
                  <Text
                    style={[
                      styles.accountRowTitle,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    Account Settings
                  </Text>

                  <Text
                    style={[
                      styles.accountRowSubtitle,
                      {
                        color:
                          colors.secondaryText,
                      },
                    ]}
                  >
                    Manage app preferences
                  </Text>
                </View>
              </View>

              <Ionicons
                name="chevron-forward"
                size={22}
                color={
                  colors.secondaryText
                }
              />
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },

  profileName: {
    fontSize: 23,
    fontWeight: "700",
    marginBottom: 5,
  },

  profileEmail: {
    fontSize: 15,
  },

  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    marginBottom: 18,
  },

  sectionHeader: {
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  fieldContainer: {
    marginBottom: 22,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  value: {
    fontSize: 17,
    fontWeight: "500",
  },

  input: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 15,
    fontSize: 16,
  },

  helperText: {
    fontSize: 12,
    marginTop: 7,
  },

  primaryButton: {
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  editActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },

  secondaryButton: {
    flex: 1,
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },

  saveButton: {
    flex: 1,
    marginBottom: 0,
  },

  accountCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
  },

  accountTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },

  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },

  accountRowContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  accountIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  accountRowTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },

  accountRowSubtitle: {
    fontSize: 13,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
});

export default ProfileScreen;