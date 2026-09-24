import React from "react";

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text
} from "react-native";

import {
  useTheme
} from "../hooks/useTheme";

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false
}: Props) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={
        disabled || loading
      }
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor:
            theme.colors.primary,
          opacity:
            pressed ||
            disabled ||
            loading
              ? 0.6
              : 1
        }
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color="#FFFFFF"
        />
      ) : (
        <Text
          style={styles.text}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles =
  StyleSheet.create({
    button: {
      minHeight: 50,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
      marginVertical: 8
    },

    text: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700"
    }
  });