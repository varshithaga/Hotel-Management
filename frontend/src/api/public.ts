import axios from "axios";
import type { Room as DisplayRoom } from "../types";

// Injected by Vite (see vite.config.ts). Same value the admin app uses.
declare const __API_URL__: string;

const API_URL: string = __API_URL__;

const publicUrl = (path: string): string => `${API_URL}api/public/${path}`;

export interface RoomImage {
  id: number;
  room_id: number;
  image_url: string;
}

export interface Amenity {
  id: number;
  name: string;
  icon?: string | null;
}

export interface RoomType {
  id: number;
  name: string;
  description?: string | null;
}

export interface PublicRoom {
  id: number;
  name: string;
  price_per_night: number;
  capacity?: number | null;
  no_of_beds?: number | null;
  description?: string | null;
  is_active: boolean;
  is_it_reserved: boolean;
  floor_id: number;
  room_type_id: number;
  room_type_name?: string | null;
  floor_name?: string | null;
  images: RoomImage[];
  amenities: Amenity[];
}

export interface Availability {
  check_in: string;
  check_out: string;
  nights: number;
  guests: number | null;
  count: number;
  available_rooms: PublicRoom[];
}

export interface RoomQuery {
  roomTypeId?: number;
  guests?: number;
}

export interface AvailabilityQuery {
  checkIn: string;
  checkOut: string;
  guests?: number;
  roomTypeId?: number;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80";

/** Adapt a backend room to the shape the presentational components expect. */
export const roomImageUrl = (room: PublicRoom): string =>
  room.images[0]?.image_url || FALLBACK_IMAGE;

export const toDisplayRoom = (room: PublicRoom, soldOut = false): DisplayRoom => {
  const desc = room.description ?? `${room.room_type_name ?? "Room"} at Grandeur Hotel.`;
  return {
    id: String(room.id),
    name: room.name,
    image: roomImageUrl(room),
    price: room.price_per_night,
    description: desc,
    shortDescription: desc.length > 90 ? `${desc.slice(0, 87)}...` : desc,
    guests: room.capacity ?? 2,
    bed: room.no_of_beds ? `${room.no_of_beds} Bed${room.no_of_beds > 1 ? "s" : ""}` : undefined,
    roomType: room.room_type_name ?? undefined,
    soldOut,
  };
};

export const getRooms = async (query: RoomQuery = {}): Promise<PublicRoom[]> => {
  const params: Record<string, unknown> = {};
  if (query.roomTypeId != null) params.room_type_id = query.roomTypeId;
  if (query.guests != null) params.guests = query.guests;
  const res = await axios.get(publicUrl("rooms/"), { params });
  return res.data as PublicRoom[];
};

export const getRoomById = async (id: number): Promise<PublicRoom> => {
  const res = await axios.get(publicUrl(`rooms/${id}`));
  return res.data as PublicRoom;
};

export const getRoomTypes = async (): Promise<RoomType[]> => {
  const res = await axios.get(publicUrl("room-types/"));
  return res.data as RoomType[];
};

export const getAmenities = async (): Promise<Amenity[]> => {
  const res = await axios.get(publicUrl("amenities/"));
  return res.data as Amenity[];
};

export const getAvailability = async (query: AvailabilityQuery): Promise<Availability> => {
  const params: Record<string, unknown> = {
    check_in: query.checkIn,
    check_out: query.checkOut,
  };
  if (query.guests != null) params.guests = query.guests;
  if (query.roomTypeId != null) params.room_type_id = query.roomTypeId;
  const res = await axios.get(publicUrl("availability/"), { params });
  return res.data as Availability;
};
