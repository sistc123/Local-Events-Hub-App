import React, {
  useCallback,
  useEffect,
  useState
} from "react";

import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Event } from "../../types/event";

import { getMyRSVPs } from "../../services/rsvpService";

import { useTheme } from "../../hooks/useTheme";

const formatEventDate = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};

const formatEventTime = (timeStr: string) => {
  if (!timeStr) return "";
  // handles "HH:mm:ss" style values
  const [h, m] = timeStr.split(":");
  if (h === undefined || m === undefined) return timeStr;
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = ((hour + 11) % 12) + 1;
  return `${displayHour}:${m} ${suffix}`;
};

const MyEventsScreen = () => {
  const { theme } = useTheme();

  const [events, setEvents] =
    useState<Event[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const load = useCallback(
    async () => {
      try {
        setError(null);

        const data =
          await getMyRSVPs();

        setEvents(data);
      } catch (err: any) {
        console.error(
          "MY EVENTS ERROR:",
          err
        );

        setEvents([]);

        setError(
          err?.response?.data?.message ||
            "Unable to load your RSVPs"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    load();
  }, [load]);

  const handleRefresh =
    async () => {
      setRefreshing(true);

      await load();

      setRefreshing(false);
    };

  if (loading) {
    return (
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={[
          styles.center,
          {
            backgroundColor:
              theme.colors.background
          }
        ]}
      >
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
        />

        <Text
          style={[
            styles.loadingText,
            {
              color: theme.colors.text
            }
          ]}
        >
          Loading your events...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[
        styles.container,
        {
          backgroundColor:
            theme.colors.background
        }
      ]}
    >
      {error ? (
        <View
          style={[
            styles.errorContainer,
            {
              backgroundColor:
                theme.colors.surface
            }
          ]}
        >
          <Text
            style={[
              styles.errorText,
              {
                color:
                  theme.colors.danger
              }
            ]}
          >
            {error}
          </Text>
        </View>
      ) : null}

      <FlatList
        data={events}
        keyExtractor={(item) =>
          String(item.id)
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        contentContainerStyle={
          events.length === 0
            ? styles.emptyList
            : styles.list
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor:
                  theme.colors.surface,
                borderColor:
                  theme.colors.border
              }
            ]}
          >
            <Text
              style={[
                styles.title,
                {
                  color:
                    theme.colors.text
                }
              ]}
            >
              {item.title}
            </Text>

            <Text
              style={[
                styles.info,
                {
                  color:
                    theme.colors.secondaryText
                }
              ]}
            >
              {formatEventDate(item.event_date)} ·{" "}
              {formatEventTime(item.event_time)}
            </Text>

            <Text
              style={[
                styles.info,
                {
                  color:
                    theme.colors.secondaryText
                }
              ]}
            >
              {item.location}
            </Text>

            {item.rsvp_status ? (
              <Text
                style={[
                  styles.status,
                  {
                    color:
                      theme.colors.success
                  }
                ]}
              >
                RSVP: {item.rsvp_status}
              </Text>
            ) : null}
          </View>
        )}
        ListEmptyComponent={
          <View
            style={styles.emptyContainer}
          >
            <Text
              style={[
                styles.emptyTitle,
                {
                  color:
                    theme.colors.text
                }
              ]}
            >
              No RSVPs yet
            </Text>

            <Text
              style={[
                styles.emptyText,
                {
                  color:
                    theme.colors.secondaryText
                }
              ]}
            >
              Events you RSVP to will appear
              here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  list: {
    padding: 16
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15
  },

  errorContainer: {
    margin: 16,
    padding: 14,
    borderRadius: 12
  },

  errorText: {
    fontSize: 14
  },

  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8
  },

  info: {
    fontSize: 14,
    marginBottom: 4
  },

  status: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 8
  },

  emptyContainer: {
    alignItems: "center"
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8
  },

  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21
  }
});

export default MyEventsScreen;