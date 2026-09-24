import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { useTheme } from "../../hooks/useTheme";
import {
  getEventById,
  updateEvent,
  EventInput,
} from "../../services/eventService";

const formatDateForInput = (value: any): string => {
  if (!value) {
    return "";
  }

  const text = String(value);

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }

  // ISO datetime:
  // 2026-10-09T18:30:00.000Z
  if (text.includes("T")) {
    return text.substring(0, 10);
  }

  // Fallback
  const date = new Date(text);

  if (!Number.isNaN(date.getTime())) {
    return date.toISOString().substring(0, 10);
  }

  return "";
};

const formatTimeForInput = (value: any): string => {
  if (!value) {
    return "";
  }

  const text = String(value);

  // Already HH:MM:SS
  if (/^\d{2}:\d{2}:\d{2}$/.test(text)) {
    return text;
  }

  // HH:MM
  if (/^\d{2}:\d{2}$/.test(text)) {
    return `${text}:00`;
  }

  // ISO datetime
  if (text.includes("T")) {
    const timePart = text.split("T")[1];

    if (timePart) {
      return timePart.replace("Z", "").substring(0, 8);
    }
  }

  return text;
};

const AdminEditEventScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { colors } = useTheme();

  const eventId = Number(route.params?.eventId);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    loadEvent();
  }, []);

  const loadEvent = async () => {
    if (!eventId || Number.isNaN(eventId)) {
      Alert.alert("Error", "Invalid event ID.");
      navigation.goBack();
      return;
    }

    try {
      setLoading(true);

      const event = await getEventById(eventId);

      setTitle(event.title || "");
      setDescription(event.description || "");
      setCategory(event.category || "");
      setLocation(event.location || "");

      setLatitude(
        event.latitude !== null &&
        event.latitude !== undefined
          ? String(event.latitude)
          : ""
      );

      setLongitude(
        event.longitude !== null &&
        event.longitude !== undefined
          ? String(event.longitude)
          : ""
      );

      // IMPORTANT:
      // Convert API date to MySQL DATE format.
      setEventDate(formatDateForInput(event.event_date));

      // IMPORTANT:
      // Convert API time to MySQL TIME format.
      setEventTime(formatTimeForInput(event.event_time));

      setImageUrl(event.image_url || "");

      setCapacity(
        event.capacity !== null &&
        event.capacity !== undefined
          ? String(event.capacity)
          : ""
      );
    } catch (error: any) {
      console.error("LOAD EVENT ERROR:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load event.";

      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (saving) {
      return;
    }

    // Basic validation
    if (!title.trim()) {
      Alert.alert("Validation", "Please enter an event title.");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Validation", "Please enter an event description.");
      return;
    }

    if (!category.trim()) {
      Alert.alert("Validation", "Please enter an event category.");
      return;
    }

    if (!location.trim()) {
      Alert.alert("Validation", "Please enter an event location.");
      return;
    }

    const capacityNumber = Number(capacity);

    if (
      !capacity.trim() ||
      Number.isNaN(capacityNumber) ||
      capacityNumber <= 0
    ) {
      Alert.alert(
        "Validation",
        "Capacity must be a number greater than 0."
      );
      return;
    }

    // -----------------------------------------
    // CLEAN DATE AND TIME
    // -----------------------------------------

    const cleanEventDate = formatDateForInput(eventDate);
    const cleanEventTime = formatTimeForInput(eventTime);

    // Validate DATE
    if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanEventDate)) {
      Alert.alert(
        "Validation",
        "Date must be in YYYY-MM-DD format.\nExample: 2026-10-09"
      );
      return;
    }

    // Validate TIME
    if (!/^\d{2}:\d{2}:\d{2}$/.test(cleanEventTime)) {
      Alert.alert(
        "Validation",
        "Time must be in HH:MM:SS format.\nExample: 18:30:00"
      );
      return;
    }

    // Validate latitude if provided
    if (latitude.trim()) {
      const latitudeNumber = Number(latitude);

      if (
        Number.isNaN(latitudeNumber) ||
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

    // Validate longitude if provided
    if (longitude.trim()) {
      const longitudeNumber = Number(longitude);

      if (
        Number.isNaN(longitudeNumber) ||
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

    const eventData: EventInput = {
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      location: location.trim(),

      latitude: latitude.trim()
        ? Number(latitude)
        : null,

      longitude: longitude.trim()
        ? Number(longitude)
        : null,

      // These are now guaranteed to match MySQL.
      event_date: cleanEventDate,
      event_time: cleanEventTime,

      image_url: imageUrl.trim() || null,

      capacity: capacityNumber,
    };

    try {
      setSaving(true);

      console.log("UPDATING EVENT:", eventData);

      await updateEvent(eventId, eventData);

      Alert.alert(
        "Success",
        "Event updated successfully.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      console.error("UPDATE EVENT ERROR:", error);

      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to update event.";

      Alert.alert(
        "Update Failed",
        backendMessage
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
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
            { color: colors.text },
          ]}
        >
          Loading event...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* TITLE */}
        <Text
          style={[
            styles.label,
            { color: colors.text },
          ]}
        >
          Event Title *
        </Text>

        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter event title"
          placeholderTextColor={colors.secondaryText}
          style={[
            styles.input,
            {
              backgroundColor: colors.input,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />

        {/* DESCRIPTION */}
        <Text
          style={[
            styles.label,
            { color: colors.text },
          ]}
        >
          Description *
        </Text>

        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Enter event description"
          placeholderTextColor={colors.secondaryText}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          style={[
            styles.input,
            styles.textArea,
            {
              backgroundColor: colors.input,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />

        {/* CATEGORY */}
        <Text
          style={[
            styles.label,
            { color: colors.text },
          ]}
        >
          Category *
        </Text>

        <TextInput
          value={category}
          onChangeText={setCategory}
          placeholder="e.g. Music, Sports, Education"
          placeholderTextColor={colors.secondaryText}
          style={[
            styles.input,
            {
              backgroundColor: colors.input,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />

        {/* LOCATION */}
        <Text
          style={[
            styles.label,
            { color: colors.text },
          ]}
        >
          Location *
        </Text>

        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Enter event location"
          placeholderTextColor={colors.secondaryText}
          style={[
            styles.input,
            {
              backgroundColor: colors.input,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />

        {/* LATITUDE */}
        <Text
          style={[
            styles.label,
            { color: colors.text },
          ]}
        >
          Latitude
        </Text>

        <TextInput
          value={latitude}
          onChangeText={setLatitude}
          placeholder="e.g. 26.9124"
          placeholderTextColor={colors.secondaryText}
          keyboardType="numeric"
          style={[
            styles.input,
            {
              backgroundColor: colors.input,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />

        {/* LONGITUDE */}
        <Text
          style={[
            styles.label,
            { color: colors.text },
          ]}
        >
          Longitude
        </Text>

        <TextInput
          value={longitude}
          onChangeText={setLongitude}
          placeholder="e.g. 75.7873"
          placeholderTextColor={colors.secondaryText}
          keyboardType="numeric"
          style={[
            styles.input,
            {
              backgroundColor: colors.input,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />

        {/* DATE */}
        <Text
          style={[
            styles.label,
            { color: colors.text },
          ]}
        >
          Event Date *
        </Text>

        <TextInput
          value={eventDate}
          onChangeText={setEventDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.secondaryText}
          autoCapitalize="none"
          style={[
            styles.input,
            {
              backgroundColor: colors.input,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />

        <Text
          style={[
            styles.helpText,
            { color: colors.secondaryText },
          ]}
        >
          Format: YYYY-MM-DD (example: 2026-10-09)
        </Text>

        {/* TIME */}
        <Text
          style={[
            styles.label,
            { color: colors.text },
          ]}
        >
          Event Time *
        </Text>

        <TextInput
          value={eventTime}
          onChangeText={setEventTime}
          placeholder="HH:MM:SS"
          placeholderTextColor={colors.secondaryText}
          autoCapitalize="none"
          style={[
            styles.input,
            {
              backgroundColor: colors.input,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />

        <Text
          style={[
            styles.helpText,
            { color: colors.secondaryText },
          ]}
        >
          Format: HH:MM:SS (example: 18:30:00)
        </Text>

        {/* IMAGE URL */}
        <Text
          style={[
            styles.label,
            { color: colors.text },
          ]}
        >
          Image URL
        </Text>

        <TextInput
          value={imageUrl}
          onChangeText={setImageUrl}
          placeholder="https://example.com/image.jpg"
          placeholderTextColor={colors.secondaryText}
          autoCapitalize="none"
          keyboardType="url"
          style={[
            styles.input,
            {
              backgroundColor: colors.input,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />

        {/* CAPACITY */}
        <Text
          style={[
            styles.label,
            { color: colors.text },
          ]}
        >
          Capacity *
        </Text>

        <TextInput
          value={capacity}
          onChangeText={setCapacity}
          placeholder="e.g. 100"
          placeholderTextColor={colors.secondaryText}
          keyboardType="numeric"
          style={[
            styles.input,
            {
              backgroundColor: colors.input,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />

        {/* SAVE BUTTON */}
        <View style={styles.buttonContainer}>
          <Text
            onPress={saving ? undefined : handleSave}
            style={[
              styles.saveButton,
              {
                backgroundColor: saving
                  ? colors.secondaryText
                  : colors.primary,
                color: "#FFFFFF",
              },
            ]}
          >
            {saving
              ? "Saving..."
              : "Update Event"}
          </Text>
        </View>

        {/* CANCEL BUTTON */}
        <View style={styles.buttonContainer}>
          <Text
            onPress={
              saving
                ? undefined
                : () => navigation.goBack()
            }
            style={[
              styles.cancelButton,
              {
                backgroundColor: colors.input,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
          >
            Cancel
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 14,
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
  },

  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },

  helpText: {
    fontSize: 12,
    marginTop: 5,
  },

  buttonContainer: {
    marginTop: 20,
  },

  saveButton: {
    textAlign: "center",
    paddingVertical: 15,
    borderRadius: 10,
    fontSize: 16,
    fontWeight: "700",
    overflow: "hidden",
  },

  cancelButton: {
    textAlign: "center",
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    fontWeight: "600",
    overflow: "hidden",
  },
});

export default AdminEditEventScreen;