import Constants from "expo-constants";

function isExpoGo(): boolean {
  return Constants.executionEnvironment === "storeClient";
}

/**
 * Request notification permission.
 *
 * In Expo Go:
 * Remote push notifications are unavailable.
 *
 * In a Development Build:
 * expo-notifications is loaded dynamically.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  if (isExpoGo()) {
    console.log(
      "Remote push notifications are unavailable in Expo Go."
    );

    return false;
  }

  try {
    const Notifications = await import("expo-notifications");

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const permission =
        await Notifications.requestPermissionsAsync();

      finalStatus = permission.status;
    }

    return finalStatus === "granted";
  } catch (error) {
    console.log(
      "Notification permission error:",
      error
    );

    return false;
  }
}

/**
 * Configure Android notification channel.
 */
export async function setupNotificationChannel(): Promise<void> {
  if (isExpoGo()) {
    return;
  }

  try {
    const Notifications =
      await import("expo-notifications");

    await Notifications.setNotificationChannelAsync(
      "default",
      {
        name: "Default",
        importance:
          Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#2563EB",
      }
    );
  } catch (error) {
    console.log(
      "Notification channel error:",
      error
    );
  }
}

/**
 * Get Expo Push Token.
 *
 * Works in Development Build.
 * Returns null in Expo Go.
 */
export async function registerForPushNotificationsAsync(): Promise<
  string | null
> {
  if (isExpoGo()) {
    console.log(
      "Expo Go detected. Remote push token is unavailable."
    );

    return null;
  }

  try {
    await setupNotificationChannel();

    const permission =
      await requestNotificationPermissions();

    if (!permission) {
      return null;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId;

    if (!projectId) {
      console.log(
        "EAS project ID is missing."
      );

      return null;
    }

    const Notifications =
      await import("expo-notifications");

    const token =
      await Notifications.getExpoPushTokenAsync({
        projectId,
      });

    console.log(
      "Expo Push Token:",
      token.data
    );

    return token.data;
  } catch (error) {
    console.log(
      "Push registration error:",
      error
    );

    return null;
  }
}

/**
 * Register device token with backend.
 */
export async function registerDeviceWithBackend(): Promise<boolean> {
  const token =
    await registerForPushNotificationsAsync();

  if (!token) {
    return false;
  }

  try {
    /*
      Later connect this to:

      await api.post("/notifications/register", {
        token,
      });
    */

    console.log(
      "Device notification token ready:",
      token
    );

    return true;
  } catch (error) {
    console.log(
      "Backend notification registration error:",
      error
    );

    return false;
  }
}

/**
 * Local notification.
 *
 * Local notifications can be used in Expo Go,
 * but we keep this disabled until explicitly used.
 */
export async function scheduleLocalNotification(
  title: string,
  body: string
): Promise<string | null> {
  try {
    const Notifications =
      await import("expo-notifications");

    const permission =
      await Notifications.getPermissionsAsync();

    if (permission.status !== "granted") {
      const requested =
        await Notifications.requestPermissionsAsync();

      if (requested.status !== "granted") {
        return null;
      }
    }

    if (!isExpoGo()) {
      await setupNotificationChannel();
    }

    const id =
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: "default",
        },
        trigger: null,
      });

    return id;
  } catch (error) {
    console.log(
      "Local notification error:",
      error
    );

    return null;
  }
}