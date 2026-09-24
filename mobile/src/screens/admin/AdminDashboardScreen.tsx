import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../hooks/useTheme";

export default function AdminDashboardScreen() {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Admin Dashboard
      </Text>

      <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
        Manage Local Events Hub
      </Text>

      <View
        style={[
          styles.adminBadge,
          { backgroundColor: colors.input },
        ]}
      >
        <Text
          style={[
            styles.adminBadgeText,
            { color: colors.primary },
          ]}
        >
          ADMINISTRATOR
        </Text>
      </View>

      <View style={styles.grid}>

        {/* MANAGE EVENTS */}
        <Pressable
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={() => navigation.navigate("AdminEvents")}
        >
          <Text style={styles.icon}>📅</Text>

          <Text
            style={[
              styles.cardTitle,
              { color: colors.text },
            ]}
          >
            Manage Events
          </Text>

          <Text
            style={[
              styles.cardText,
              { color: colors.secondaryText },
            ]}
          >
            View, edit and delete existing events
          </Text>
        </Pressable>

        {/* CREATE EVENT */}
        <Pressable
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={() => navigation.navigate("AdminCreateEvent")}
        >
          <Text style={styles.icon}>＋</Text>

          <Text
            style={[
              styles.cardTitle,
              { color: colors.text },
            ]}
          >
            Create Event
          </Text>

          <Text
            style={[
              styles.cardText,
              { color: colors.secondaryText },
            ]}
          >
            Publish a new local event
          </Text>
        </Pressable>

      </View>

      <View
        style={[
          styles.infoBox,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.infoTitle,
            { color: colors.text },
          ]}
        >
          Administrator Access
        </Text>

        <Text
          style={[
            styles.infoText,
            { color: colors.secondaryText },
          ]}
        >
          Event creation, editing and deletion are protected by
          authenticated JWT requests and server-side administrator
          authorization.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    marginBottom: 15,
  },

  adminBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 20,
  },

  adminBadgeText: {
    fontSize: 12,
    fontWeight: "800",
  },

  grid: {
    gap: 14,
  },

  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    minHeight: 145,
    justifyContent: "center",
  },

  icon: {
    fontSize: 30,
    marginBottom: 10,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 6,
  },

  cardText: {
    fontSize: 14,
    lineHeight: 20,
  },

  infoBox: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },

  infoText: {
    fontSize: 14,
    lineHeight: 21,
  },
});