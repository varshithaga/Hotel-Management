import { createApiUrl, getAuthHeaders } from "../../access/access";
import axios from "axios";

export interface Department {
  id?: number;
  name: string;
  description?: string;
}

export interface PaginatedResponses<T> {
  count: number;
  next: number | null;
  previous: number | null;
  current_page: number;
  total_pages: number;
  results: T[];
}

const basePath = "api/departments/";

export const createDepartment = async (data: Department) => {
  return (await axios.post(createApiUrl(basePath), data, { headers: await getAuthHeaders() })).data;
};

export const getDepartmentList = async (
  page: number = 1,
  limit: number | "all" = 10,
  search?: string
): Promise<PaginatedResponses<Department>> => {
  const params: Record<string, unknown> = { page };
  if (limit !== "all") params.limit = limit;
  if (search) params.search = search;
  const isAll = limit === "all";
  const url = createApiUrl(isAll ? `${basePath}all/` : basePath);
  const response = await axios.get(url, { headers: await getAuthHeaders(), params: isAll ? { search } : params });
  if (isAll) {
    const rows = response.data as Department[];
    return { count: rows.length, next: null, previous: null, current_page: 1, total_pages: 1, results: rows };
  }
  return response.data as PaginatedResponses<Department>;
};

export const getDepartmentById = async (id: number) => {
  return (await axios.get(createApiUrl(`${basePath}${id}/`), { headers: await getAuthHeaders() })).data;
};

export const updateDepartment = async (id: number, data: Partial<Department>) => {
  return (await axios.put(createApiUrl(`${basePath}${id}/`), data, { headers: await getAuthHeaders() })).data;
};

export const deleteDepartment = async (id: number) => {
  return (await axios.delete(createApiUrl(`${basePath}${id}/`), { headers: await getAuthHeaders() })).data;
};
