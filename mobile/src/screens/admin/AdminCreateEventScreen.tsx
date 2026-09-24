import React, { useState } from "react";
import {
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
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../hooks/useTheme";
import {
  createEvent,
  EventInput,
} from "../../services/eventService";

/**
 * Convert a date value to YYYY-MM-DD.
 */
const formatDateForInput = (value: string): string => {
  if (!value) {
    return "";
  }

  const text = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }

  if (text.includes("T")) {
    return text.substring(0, 10);
  }

  return text;
};

/**
 * Convert a time value to HH:MM:SS.
 */
const formatTimeForInput = (value: string): string => {
  if (!value) {
    return "";
  }

  const text = String(value).trim();

  if (/^\d{2}:\d{2}:\d{2}$/.test(text)) {
    return text;
  }

  if (/^\d{2}:\d{2}$/.test(text)) {
    return `${text}:00`;
  }

  if (text.includes("T")) {
    const timePart = text.split("T")[1];

    if (timePart) {
      return timePart
        .replace("Z", "")
        .substring(0, 8);
    }
  }

  return text;
};

/**
 * Validate YYYY-MM-DD.
 */
const isValidDate = (dateString: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }

  const [year, month, day] = dateString
    .split("-")
    .map(Number);

  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

/**
 * Validate HH:MM:SS.
 */
const isValidTime = (timeString: string): boolean => {
  if (!/^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
    return false;
  }

  const [hours, minutes, seconds] = timeString
    .split(":")
    .map(Number);

  return (
    hours >= 0 &&
    hours <= 23 &&
    minutes >= 0 &&
    minutes <= 59 &&
    seconds >= 0 &&
    seconds <= 59
  );
};

export default function AdminCreateEventScreen() {
  const navigation = useNavigation<any>();

  const { colors } = useTheme();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");

  const [imageUrl, setImageUrl] = useState("");
  const [capacity, setCapacity] = useState("");

  const [saving, setSaving] = useState(false);

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.input,
      color: colors.text,
      borderColor: colors.border,
    },
  ];

  const handleCreate = async () => {
    if (saving) {
      return;
    }

    // -----------------------------
    // BASIC VALIDATION
    // -----------------------------

    if (!title.trim()) {
      Alert.alert("Validation", "Enter an event title.");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Validation", "Enter an event description.");
      return;
    }

    if (!category.trim()) {
      Alert.alert("Validation", "Enter an event category.");
      return;
    }

    if (!location.trim()) {
      Alert.alert("Validation", "Enter an event location.");
      return;
    }

    // -----------------------------
    // DATE VALIDATION
    // -----------------------------

    const cleanEventDate = formatDateForInput(eventDate);

    if (!cleanEventDate) {
      Alert.alert("Validation", "Enter an event date.");
      return;
    }

    if (!isValidDate(cleanEventDate)) {
      Alert.alert(
        "Validation",
        "Date must be a valid YYYY-MM-DD date.\n\nExample:\n2026-10-09"
      );
      return;
    }

    // -----------------------------
    // TIME VALIDATION
    // -----------------------------

    const cleanEventTime = formatTimeForInput(eventTime);

    if (!cleanEventTime) {
      Alert.alert("Validation", "Enter an event time.");
      return;
    }

    if (!isValidTime(cleanEventTime)) {
      Alert.alert(
        "Validation",
        "Time must be a valid HH:MM:SS time.\n\nExample:\n18:30:00"
      );
      return;
    }

    // -----------------------------
    // CAPACITY VALIDATION
    // -----------------------------

    const capacityNumber = Number(capacity.trim());

    if (
      !capacity.trim() ||
      !Number.isFinite(capacityNumber) ||
      capacityNumber <= 0 ||
      !Number.isInteger(capacityNumber)
    ) {
      Alert.alert(
        "Validation",
        "Enter a valid positive whole-number capacity."
      );
      return;
    }

    // -----------------------------
    // LATITUDE VALIDATION
    // -----------------------------

    let latitudeNumber: number | null = null;

    if (latitude.trim()) {
      latitudeNumber = Number(latitude.trim());

      if (
        !Number.isFinite(latitudeNumber) ||
        latitudeNumber < -90 ||
        latitudeNumber > 90
      ) {
        Alert.alert(
          "Validation",
          "Latitude must be between -90 and 90."
        );
        return;
      }
    }

    // -----------------------------
    // LONGITUDE VALIDATION
    // -----------------------------

    let longitudeNumber: number | null = null;

    if (longitude.trim()) {
      longitudeNumber = Number(longitude.trim());

      if (
        !Number.isFinite(longitudeNumber) ||
        longitudeNumber < -180 ||
        longitudeNumber > 180
      ) {
        Alert.alert(
          "Validation",
          "Longitude must be between -180 and 180."
        );
        return;
      }
    }

    // -----------------------------
    // EVENT DATA
    // -----------------------------

    const eventData: EventInput = {
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      location: location.trim(),

      latitude: latitudeNumber,
      longitude: longitudeNumber,

      event_date: cleanEventDate,
      event_time: cleanEventTime,

      image_url: imageUrl.trim() || null,

      capacity: capacityNumber,
    };

    console.log("CREATE EVENT DATA:", eventData);

    // -----------------------------
    // CREATE EVENT
    // -----------------------------

    try {
      setSaving(true);

      await createEvent(eventData);

      Alert.alert(
        "Success",
        "Event created successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error(
        "CREATE EVENT ERROR:",
        error?.response?.data || error
      );

      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to create event.";

      Alert.alert(
        "Create Event Failed",
        backendMessage
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}

        <Text
          style={[
            styles.heading,
            {
              color: colors.text,
            },
          ]}
        >
          Create New Event
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          Add an event to Local Events Hub.
        </Text>

        {/* TITLE */}

        <Text
          style={[
            styles.label,
            {
              color: colors.text,
            },
          ]}
        >
          Event Title *
        </Text>

        <TextInput
          style={inputStyle}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Community Food Festival"
          placeholderTextColor={colors.secondaryText}
          editable={!saving}
        />

        {/* DESCRIPTION */}

        <Text
          style={[
            styles.label,
            {
              color: colors.text,
            },
          ]}
        >
          Description *
        </Text>

        <TextInput
          style={[
            inputStyle,
            styles.textArea,
          ]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the event"
          placeholderTextColor={colors.secondaryText}
          multiline
          textAlignVertical="top"
          editable={!saving}
        />

        {/* CATEGORY */}

        <Text
          style={[
            styles.label,
            {
              color: colors.text,
            },
          ]}
        >
          Category *
        </Text>

        <TextInput
          style={inputStyle}
          value={category}
          onChangeText={setCategory}
          placeholder="e.g. Community"
          placeholderTextColor={colors.secondaryText}
          editable={!saving}
        />

        {/* LOCATION */}

        <Text
          style={[
            styles.label,
            {
              color: colors.text,
            },
          ]}
        >
          Location *
        </Text>

        <TextInput
          style={inputStyle}
          value={location}
          onChangeText={setLocation}
          placeholder="e.g. City Community Hall"
          placeholderTextColor={colors.secondaryText}
          editable={!saving}
        />

        {/* LATITUDE */}

        <Text
          style={[
            styles.label,
            {
              color: colors.text,
            },
          ]}
        >
          Latitude
        </Text>

        <TextInput
          style={inputStyle}
          value={latitude}
          onChangeText={setLatitude}
          placeholder="e.g. -31.9505"
          placeholderTextColor={colors.secondaryText}
          keyboardType="decimal-pad"
          editable={!saving}
        />

        {/* LONGITUDE */}

        <Text
          style={[
            styles.label,
            {
              color: colors.text,
            },
          ]}
        >
          Longitude
        </Text>

        <TextInput
          style={inputStyle}
          value={longitude}
          onChangeText={setLongitude}
          placeholder="e.g. 115.8605"
          placeholderTextColor={colors.secondaryText}
          keyboardType="decimal-pad"
          editable={!saving}
        />

        {/* EVENT DATE */}

        <Text
          style={[
            styles.label,
            {
              color: colors.text,
            },
          ]}
        >
          Event Date *
        </Text>

        <TextInput
          style={inputStyle}
          value={eventDate}
          onChangeText={setEventDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.secondaryText}
          autoCapitalize="none"
          editable={!saving}
        />

        <Text
          style={[
            styles.helpText,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          Required format: YYYY-MM-DD
        </Text>

        {/* EVENT TIME */}

        <Text
          style={[
            styles.label,
            {
              color: colors.text,
            },
          ]}
        >
          Event Time *
        </Text>

        <TextInput
          style={inputStyle}
          value={eventTime}
          onChangeText={setEventTime}
          placeholder="HH:MM:SS"
          placeholderTextColor={colors.secondaryText}
          autoCapitalize="none"
          editable={!saving}
        />

        <Text
          style={[
            styles.helpText,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          Required format: HH:MM:SS
        </Text>

        {/* CAPACITY */}

        <Text
          style={[
            styles.label,
            {
              color: colors.text,
            },
          ]}
        >
          Capacity *
        </Text>

        <TextInput
          style={inputStyle}
          value={capacity}
          onChangeText={setCapacity}
          placeholder="e.g. 100"
          placeholderTextColor={colors.secondaryText}
          keyboardType="numeric"
          editable={!saving}
        />

        {/* IMAGE URL */}

        <Text
          style={[
            styles.label,
            {
              color: colors.text,
            },
          ]}
        >
          Image URL
        </Text>

        <TextInput
          style={inputStyle}
          value={imageUrl}
          onChangeText={setImageUrl}
          placeholder="https://..."
          placeholderTextColor={colors.secondaryText}
          autoCapitalize="none"
          keyboardType="url"
          editable={!saving}
        />

        {/* CREATE BUTTON */}

        <Pressable
          style={[
            styles.createButton,
            {
              backgroundColor: colors.primary,
              opacity: saving ? 0.6 : 1,
            },
          ]}
          disabled={saving}
          onPress={handleCreate}
        >
          <View style={styles.createButtonContent}>
            {!saving && (
              <Ionicons
                name="add-circle-outline"
                size={21}
                color="#FFFFFF"
              />
            )}

            <Text style={styles.createButtonText}>
              {saving
                ? "Creating Event..."
                : "Create Event"}
            </Text>
          </View>
        </Pressable>

        {/* CANCEL BUTTON */}

        <Pressable
          style={[
            styles.cancelButton,
            {
              borderColor: colors.border,
              opacity: saving ? 0.5 : 1,
            },
          ]}
          disabled={saving}
          onPress={() => navigation.goBack()}
        >
          <Text
            style={[
              styles.cancelText,
              {
                color: colors.text,
              },
            ]}
          >
            Cancel
          </Text>
        </Pressable>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  heading: {
    fontSize: 27,
    fontWeight: "800",
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 12,
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
  },

  textArea: {
    minHeight: 110,
    paddingTop: 12,
    textAlignVertical: "top",
  },

  helpText: {
    fontSize: 12,
    marginTop: 5,
  },

  createButton: {
    marginTop: 28,
    minHeight: 52,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },

  createButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  cancelButton: {
    marginTop: 12,
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },

  cancelText: {
    fontSize: 15,
    fontWeight: "700",
  },

  bottomSpacing: {
    height: 20,
  },
});