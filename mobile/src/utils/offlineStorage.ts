import AsyncStorage from
  "@react-native-async-storage/async-storage";

const EVENTS_CACHE_KEY =
  "cached_events";

export async function saveEventsOffline(
  events: unknown[]
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      EVENTS_CACHE_KEY,
      JSON.stringify(events)
    );
  } catch (error) {
    console.log(
      "Unable to save events offline:",
      error
    );
  }
}

export async function getOfflineEvents(): Promise<
  unknown[] | null
> {
  try {
    const cached =
      await AsyncStorage.getItem(
        EVENTS_CACHE_KEY
      );

    if (!cached) {
      return null;
    }

    return JSON.parse(cached);
  } catch (error) {
    console.log(
      "Unable to read offline events:",
      error
    );

    return null;
  }
}

export async function clearOfflineEvents(): Promise<void> {
  try {
    await AsyncStorage.removeItem(
      EVENTS_CACHE_KEY
    );
  } catch (error) {
    console.log(
      "Unable to clear offline events:",
      error
    );
  }
}