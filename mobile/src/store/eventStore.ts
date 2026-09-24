import {
  create
} from "zustand";

import {
  Event
} from "../types/event";

import {
  getEvents
} from "../services/eventService";

interface EventState {
  events: Event[];
  isLoading: boolean;
  error: string | null;

  loadEvents: () => Promise<void>;
}

export const useEventStore =
  create<EventState>(
    (set) => ({
      events: [],
      isLoading: false,
      error: null,

      loadEvents: async () => {
        set({
          isLoading: true,
          error: null
        });

        try {
          const events =
            await getEvents();

          set({
            events,
            isLoading: false
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              "Unable to load events."
          });
        }
      }
    })
  );