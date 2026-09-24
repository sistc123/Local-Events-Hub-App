import React from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { Event } from "../types/event";

import { useTheme } from "../hooks/useTheme";

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor:
            theme.colors.surface,
          borderColor:
            theme.colors.border
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.text
            }
          ]}
          numberOfLines={2}
        >
          {event.title}
        </Text>

        {event.category ? (
          <View
            style={[
              styles.categoryContainer,
              {
                backgroundColor:
                  theme.colors.primary
              }
            ]}
          >
            <Text
              style={styles.categoryText}
            >
              {event.category}
            </Text>
          </View>
        ) : null}
      </View>

      <Text
        style={[
          styles.description,
          {
            color:
              theme.colors.secondaryText
          }
        ]}
        numberOfLines={3}
      >
        {event.description ||
          "No description available."}
      </Text>

      <View style={styles.infoContainer}>
        <Text
          style={[
            styles.info,
            {
              color:
                theme.colors.secondaryText
            }
          ]}
        >
          Date: {event.event_date}
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
          Time: {event.event_time}
        </Text>

        <Text
          style={[
            styles.info,
            {
              color:
                theme.colors.secondaryText
            }
          ]}
          numberOfLines={1}
        >
          Location: {event.location}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14
  },

  header: {
    marginBottom: 10
  },

  title: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 8
  },

  categoryContainer: {
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5
  },

  categoryText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600"
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12
  },

  infoContainer: {
    gap: 5
  },

  info: {
    fontSize: 13
  }
});

export default EventCard;