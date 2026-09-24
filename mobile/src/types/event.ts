export interface Event {
  id: number;

  title: string;

  description?: string | null;

  category?: string | null;

  location: string;

  latitude?: number | null;

  longitude?: number | null;

  event_date: string;

  event_time: string;

  image_url?: string | null;

  capacity?: number | null;

  created_by?: number | null;

  created_at?: string;

  rsvp_status?: string | null;

  attendee_count?: number;
}