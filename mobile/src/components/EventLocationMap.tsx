import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import MapView, {
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";

import { useTheme } from "../hooks/useTheme";

interface EventLocationMapProps {
  latitude: number;
  longitude: number;
  title: string;
  address?: string;
}

export default function EventLocationMap({
  latitude,
  longitude,
  title,
  address,
}: EventLocationMapProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.heading,
          {
            color: theme.colors.text,
          },
        ]}
      >
        Event Location
      </Text>

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude,
            longitude,
          }}
          title={title}
          description={address}
        />
      </MapView>

      {address ? (
        <Text
          style={[
            styles.address,
            {
              color:
                theme.colors.secondaryText,
            },
          ]}
        >
          {address}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },

  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },

  map: {
    width: "100%",
    height: 220,
    borderRadius: 16,
  },

  address: {
    marginTop: 8,
    fontSize: 14,
  },
});