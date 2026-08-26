import { createApiUrl, getAuthHeaders } from "../../access/access";
import axios from "axios";

export interface AllBooking {
  id?: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  user_photo?: string;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  no_of_days: number;
  price: number;
  extra_charges?: number;
  discount?: number;
  total_price: number;
  any_extra_info?: string;
  was_it_reserved?: boolean;
  created_at?: string;
}

export interface PaginatedResponses<T> {
  count: number;
  next: number | null;
  previous: number | null;
  current_page: number;
  total_pages: number;
  results: T[];
}

const basePath = "api/bookings/";

export const createBooking = async (data: AllBooking) => {
  return (await axios.post(createApiUrl(basePath), data, { headers: await getAuthHeaders() })).data;
};

export const getBookingList = async (
  page: number = 1,
  limit: number | "all" = 10,
  search?: string
): Promise<PaginatedResponses<AllBooking>> => {
  const params: Record<string, unknown> = { page };
  if (limit !== "all") params.limit = limit;
  if (search) params.search = search;
  const isAll = limit === "all";
  const url = createApiUrl(isAll ? `${basePath}all/` : basePath);
  const response = await axios.get(url, { headers: await getAuthHeaders(), params: isAll ? { search } : params });
  if (isAll) {
    const rows = response.data as AllBooking[];
    return { count: rows.length, next: null, previous: null, current_page: 1, total_pages: 1, results: rows };
  }
  return response.data as PaginatedResponses<AllBooking>;
};

export const getBookingById = async (id: number) => {
  return (await axios.get(createApiUrl(`${basePath}${id}/`), { headers: await getAuthHeaders() })).data;
};

export const updateBooking = async (id: number, data: Partial<AllBooking>) => {
  return (await axios.put(createApiUrl(`${basePath}${id}/`), data, { headers: await getAuthHeaders() })).data;
};

export const deleteBooking = async (id: number) => {
  return (await axios.delete(createApiUrl(`${basePath}${id}/`), { headers: await getAuthHeaders() })).data;
};
