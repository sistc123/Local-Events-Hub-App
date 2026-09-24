import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { useTheme } from "../../hooks/useTheme";
import {
  getEvents,
  deleteEvent,
} from "../../services/eventService";
import { Event } from "../../types/event";

export default function AdminEventsScreen() {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const colors = theme.colors;

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = async () => {
    try {
      setLoading(true);

      const data = await getEvents();

      setEvents(data);
    } catch (error: any) {
      console.error("ADMIN LOAD EVENTS ERROR:", error);

      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load events."
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [])
  );

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      const data = await getEvents();

      setEvents(data);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "Unable to refresh events."
      );
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = (event: Event) => {
    Alert.alert(
      "Delete Event",
      `Are you sure you want to delete "${event.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteEvent(event.id);

              setEvents((current) =>
                current.filter((item) => item.id !== event.id)
              );

              Alert.alert(
                "Success",
                "Event deleted successfully."
              );
            } catch (error: any) {
              console.error(
                "DELETE EVENT ERROR:",
                error
              );

              Alert.alert(
                "Delete Failed",
                error?.response?.data?.message ||
                  error?.message ||
                  "Unable to delete event."
              );
            }
          },
        },
      ]
    );
  };

  const renderEvent = ({ item }: { item: Event }) => {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            { color: colors.text },
          ]}
        >
          {item.title}
        </Text>

        {!!item.category && (
          <Text
            style={[
              styles.category,
              { color: colors.primary },
            ]}
          >
            {item.category}
          </Text>
        )}

        <Text
          style={[
            styles.info,
            { color: colors.secondaryText },
          ]}
        >
          📍 {item.location}
        </Text>

        <Text
          style={[
            styles.info,
            { color: colors.secondaryText },
          ]}
        >
          📅 {item.event_date}
        </Text>

        <Text
          style={[
            styles.info,
            { color: colors.secondaryText },
          ]}
        >
          🕐 {item.event_time}
        </Text>

        {item.capacity !== null &&
          item.capacity !== undefined && (
            <Text
              style={[
                styles.info,
                { color: colors.secondaryText },
              ]}
            >
              👥 Capacity: {item.capacity}
            </Text>
          )}

        <View style={styles.actions}>

          {/* EDIT */}
          <Pressable
            style={[
              styles.editButton,
              { backgroundColor: colors.primary },
            ]}
            onPress={() =>
              navigation.navigate("AdminEditEvent", {
                eventId: item.id,
              })
            }
          >
            <Text style={styles.buttonText}>
              Edit
            </Text>
          </Pressable>

          {/* DELETE */}
          <Pressable
            style={[
              styles.deleteButton,
              { backgroundColor: colors.danger },
            ]}
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.buttonText}>
              Delete
            </Text>
          </Pressable>

        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text
          style={[
            styles.loadingText,
            { color: colors.secondaryText },
          ]}
        >
          Loading events...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.header}>
        <View>
          <Text
            style={[
              styles.heading,
              { color: colors.text },
            ]}
          >
            Manage Events
          </Text>

          <Text
            style={[
              styles.count,
              { color: colors.secondaryText },
            ]}
          >
            {events.length} event
            {events.length === 1 ? "" : "s"}
          </Text>
        </View>

        {/* ADD EVENT */}
        <Pressable
          style={[
            styles.addButton,
            { backgroundColor: colors.primary },
          ]}
          onPress={() =>
            navigation.navigate("AdminCreateEvent")
          }
        >
          <Text style={styles.addButtonText}>
            + Add
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderEvent}
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
            <Text
              style={[
                styles.emptyTitle,
                { color: colors.text },
              ]}
            >
              No Events
            </Text>

            <Text
              style={[
                styles.emptyText,
                { color: colors.secondaryText },
              ]}
            >
              Create your first event using the Add
              Event button.
            </Text>

            <Pressable
              style={[
                styles.emptyButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={() =>
                navigation.navigate(
                  "AdminCreateEvent"
                )
              }
            >
              <Text style={styles.buttonText}>
                + Create Event
              </Text>
            </Pressable>
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

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },

  header: {
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  heading: {
    fontSize: 25,
    fontWeight: "800",
  },

  count: {
    marginTop: 4,
    fontSize: 14,
  },

  addButton: {
    paddingHorizontal: 17,
    paddingVertical: 11,
    borderRadius: 10,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },

  list: {
    paddingHorizontal: 18,
    paddingBottom: 30,
  },

  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 17,
    marginBottom: 14,
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 5,
  },

  category: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
  },

  info: {
    fontSize: 14,
    marginBottom: 5,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },

  editButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 9,
    alignItems: "center",
  },

  deleteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 9,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },

  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 30,
  },

  empty: {
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },

  emptyText: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },

  emptyButton: {
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 10,
  },
});