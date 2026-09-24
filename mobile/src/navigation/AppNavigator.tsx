import React from "react";
import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import Ionicons from "@expo/vector-icons/Ionicons";

// =========================================================
// USER SCREENS
// =========================================================

import EventsScreen from "../screens/events/EventsScreen";
import EventDetailsScreen from "../screens/events/EventDetailsScreen";
import MyEventsScreen from "../screens/events/MyEventsScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";

// =========================================================
// ADMIN SCREENS
// =========================================================

import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import AdminEventsScreen from "../screens/admin/AdminEventsScreen";
import AdminCreateEventScreen from "../screens/admin/AdminCreateEventScreen";
import AdminEditEventScreen from "../screens/admin/AdminEditEventScreen";

// =========================================================
// STORES / THEME
// =========================================================

import { useTheme } from "../hooks/useTheme";
import { useAuthStore } from "../store/authStore";

// =========================================================
// NAVIGATORS
// =========================================================

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// =========================================================
// USER EVENT STACK
// =========================================================

const EventStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },

        headerTintColor: theme.colors.text,

        headerTitleStyle: {
          fontWeight: "700",
        },

        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      {/* =====================================================
          EVENTS LIST
      ===================================================== */}

      <Stack.Screen
        name="Events"
        component={EventsScreen}
        options={{
          title: "Local Events",
        }}
      />

      {/* =====================================================
          EVENT DETAILS
      ===================================================== */}

      <Stack.Screen
        name="EventDetails"
        component={EventDetailsScreen}
        options={{
          title: "Event Details",
        }}
      />
    </Stack.Navigator>
  );
};

// =========================================================
// ADMIN STACK
// =========================================================

const AdminStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="AdminDashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: "700",
        },
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ title: "Admin Dashboard" }}
      />

      <Stack.Screen
        name="AdminEvents"
        component={AdminEventsScreen}
        options={{ title: "Manage Events" }}
      />

      <Stack.Screen
        name="AdminCreateEvent"
        component={AdminCreateEventScreen}
        options={{ title: "Create Event" }}
      />

      <Stack.Screen
        name="AdminEditEvent"
        component={AdminEditEventScreen}
        options={{ title: "Edit Event" }}
      />
    </Stack.Navigator>
  );
};

// =========================================================
// MAIN APP NAVIGATOR
// =========================================================

const AppNavigator = () => {
  const { theme } = useTheme();

  // Get currently logged-in user
  const user = useAuthStore(
    (state) => state.user
  );

  // Check whether current user is administrator
  const isAdmin =
    user?.role?.toUpperCase() === "ADMIN";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Hide the default tab header.
        // Individual stack navigators manage their headers.
        headerShown: false,

        // ===================================================
        // TAB BAR STYLE
        // ===================================================

        tabBarStyle: {
          backgroundColor:
            theme.colors.surface,

          borderTopColor:
            theme.colors.border,
        },

        tabBarActiveTintColor:
          theme.colors.primary,

        tabBarInactiveTintColor:
          theme.colors.secondaryText,

        // ===================================================
        // TAB ICONS
        // ===================================================

        tabBarIcon: ({
          color,
          size,
        }) => {
          let iconName:
            keyof typeof Ionicons.glyphMap =
            "home-outline";

          // Home
          if (route.name === "Home") {
            iconName = "home-outline";
          }

          // My Events
          else if (
            route.name === "My Events"
          ) {
            iconName = "calendar-outline";
          }

          // Profile
          else if (
            route.name === "Profile"
          ) {
            iconName = "person-outline";
          }

          // Settings
          else if (
            route.name === "Settings"
          ) {
            iconName = "settings-outline";
          }

          // Admin
          else if (
            route.name === "Admin"
          ) {
            iconName =
              "shield-checkmark-outline";
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      {/* =====================================================
          USER FEATURE: HOME
      ===================================================== */}

      <Tab.Screen
        name="Home"
        component={EventStack}
        options={{
          title: "Home",
        }}
      />

      {/* =====================================================
          USER FEATURE: MY EVENTS
      ===================================================== */}

      <Tab.Screen
        name="My Events"
        component={MyEventsScreen}
        options={{
          title: "My Events",
        }}
      />

      {/* =====================================================
          USER FEATURE: PROFILE
      ===================================================== */}

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
        }}
      />

      {/* =====================================================
          USER FEATURE: SETTINGS
      ===================================================== */}

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
        }}
      />

      {/* =====================================================
          ADMIN FEATURES
          
          This tab is only rendered when the authenticated
          user's role is ADMIN.
      ===================================================== */}

      {isAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminStack}
          options={{
            title: "Admin",
          }}
        />
      )}
    </Tab.Navigator>
  );
};

// =========================================================
// EXPORT
// =========================================================

export default AppNavigator;