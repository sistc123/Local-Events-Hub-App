// src/screens/events/EventsScreen.tsx

import React, {
  useCallback,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { getEvents } from "../../services/eventService";
import EventCard from "../../components/EventCard";
import Loading from "../../components/Loading";
import { useTheme } from "../../hooks/useTheme";
import { Event } from "../../types/event";

export default function EventsScreen({
  navigation,
}: any) {
  const theme = useTheme();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const [error, setError] = useState("");

  const loadEvents = async () => {
    try {
      console.log("EVENTS SCREEN: loading events");

      setError("");

      const data = await getEvents();

      console.log(
        "EVENTS SCREEN: events received",
        data
      );

      setEvents(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.log(
        "EVENTS SCREEN ERROR:",
        error?.message || error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to load events."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme.colors.background,
        },
      ]}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.text,
              },
            ]}
          >
            Events
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: theme.colors.textSecondary,
              },
            ]}
          >
            Discover local events
          </Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Settings")
          }
          style={[
            styles.settingsButton,
            {
              backgroundColor:
                theme.colors.surface,
            },
          ]}
        >
          <Ionicons
            name="settings-outline"
            size={22}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* ERROR */}

      {error !== "" && (
        <View
          style={[
            styles.errorBox,
            {
              backgroundColor:
                theme.colors.surface,
            },
          ]}
        >
          <Text
            style={[
              styles.errorText,
              {
                color: theme.colors.error,
              },
            ]}
          >
            {error}
          </Text>

          <TouchableOpacity
            onPress={loadEvents}
            style={[
              styles.retryButton,
              {
                backgroundColor:
                  theme.colors.primary,
              },
            ]}
          >
            <Text style={styles.retryText}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* EVENTS */}

      <FlatList
        data={events}
        keyExtractor={(item, index) =>
          String(item.id ?? index)
        }
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() =>
              navigation.navigate(
                "EventDetails",
                {
                  eventId: item.id,
                }
              )
            }
          />
        )}
        contentContainerStyle={
          events.length === 0
            ? styles.emptyContainer
            : styles.list
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="calendar-outline"
              size={55}
              color={theme.colors.textSecondary}
            />

            <Text
              style={[
                styles.emptyTitle,
                {
                  color: theme.colors.text,
                },
              ]}
            >
              No events found
            </Text>

            <Text
              style={[
                styles.emptyText,
                {
                  color:
                    theme.colors.textSecondary,
                },
              ]}
            >
              There are currently no events
              available.
            </Text>

            <TouchableOpacity
              onPress={loadEvents}
              style={[
                styles.retryButton,
                {
                  backgroundColor:
                    theme.colors.primary,
                },
              ]}
            >
              <Text style={styles.retryText}>
                Refresh
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 14,
    marginTop: 3,
  },

  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  empty: {
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 15,
  },

  emptyText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },

  errorBox: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 15,
    borderRadius: 12,
  },

  errorText: {
    fontSize: 14,
    marginBottom: 10,
  },

  retryButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  settingsButtonText: {
    fontSize: 14,
  },
});