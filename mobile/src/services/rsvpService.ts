import api from "./api";

import { RSVP } from "../types/event";

export const createRSVP = async (
  eventId: number
) => {
  console.log(
    "CREATE RSVP:",
    `/events/${eventId}/rsvp`
  );

  const response = await api.post(
    `/events/${eventId}/rsvp`
  );

  console.log(
    "CREATE RSVP RESPONSE:",
    response.status,
    response.data
  );

  return response.data;
};

export const cancelRSVP = async (
  eventId: number
) => {
  console.log(
    "CANCEL RSVP:",
    `/events/${eventId}/rsvp`
  );

  const response = await api.delete(
    `/events/${eventId}/rsvp`
  );

  return response.data;
};

export const getMyRSVPs = async (): Promise<
  RSVP[]
> => {
  const response = await api.get<{
    success: boolean;
    rsvps: RSVP[];
  }>("/users/my-rsvps");

  return Array.isArray(response.data?.rsvps)
    ? response.data.rsvps
    : [];
};