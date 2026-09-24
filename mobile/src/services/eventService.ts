import api from "./api";
import { Event } from "../types/event";

interface EventsResponse {
  success: boolean;
  count: number;
  events: Event[];
  message?: string;
}

interface EventResponse {
  success: boolean;
  event: Event;
  message?: string;
}

export interface EventInput {
  title: string;
  description: string;
  category: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  event_date: string;
  event_time: string;
  image_url?: string | null;
  capacity: number;
}

export const getEvents = async (): Promise<Event[]> => {
  const response =
    await api.get<EventsResponse>("/events");

  if (!response.data.success) {
    throw new Error(
      response.data.message ||
        "Unable to load events."
    );
  }

  return response.data.events || [];
};

export const getEventById = async (
  eventId: number
): Promise<Event> => {
  const response =
    await api.get<EventResponse>(
      `/events/${eventId}`
    );

  if (!response.data.success) {
    throw new Error(
      response.data.message ||
        "Unable to load event."
    );
  }

  return response.data.event;
};

export const createEvent = async (
  eventData: EventInput
) => {
  const response = await api.post(
    "/events",
    eventData
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message ||
        "Unable to create event."
    );
  }

  return response.data;
};

export const updateEvent = async (
  eventId: number,
  eventData: EventInput
) => {
  const response = await api.put(
    `/events/${eventId}`,
    eventData
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message ||
        "Unable to update event."
    );
  }

  return response.data;
};

export const deleteEvent = async (
  eventId: number
) => {
  const response = await api.delete(
    `/events/${eventId}`
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message ||
        "Unable to delete event."
    );
  }

  return response.data;
};