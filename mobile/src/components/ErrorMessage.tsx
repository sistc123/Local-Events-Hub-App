import React from "react";

import {
  StyleSheet,
  Text,
  View
} from "react-native";

import {
  useTheme
} from "../hooks/useTheme";

interface Props {
  message: string;
}

export default function ErrorMessage({
  message
}: Props) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme.colors.surface,
          borderColor:
            theme.colors.danger
        }
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color:
              theme.colors.danger
          }
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      margin: 16,
      padding: 12,
      borderWidth: 1,
      borderRadius: 8
    },

    text: {
      fontSize: 14
    }
  });