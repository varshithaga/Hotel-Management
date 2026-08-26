import { createApiUrl, getAuthHeaders } from "../../access/access";
import axios from "axios";

export interface Employee {
  id?: number;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  department_id: number;
  role_id: number;
}

export interface PaginatedResponses<T> {
  count: number;
  next: number | null;
  previous: number | null;
  current_page: number;
  total_pages: number;
  results: T[];
}

const basePath = "api/employees/";

export const createEmployee = async (data: Employee) => {
  return (await axios.post(createApiUrl(basePath), data, { headers: await getAuthHeaders() })).data;
};

export const getEmployeeList = async (
  page: number = 1,
  limit: number | "all" = 10,
  search?: string
): Promise<PaginatedResponses<Employee>> => {
  const params: Record<string, unknown> = { page };
  if (limit !== "all") params.limit = limit;
  if (search) params.search = search;
  const isAll = limit === "all";
  const url = createApiUrl(isAll ? `${basePath}all/` : basePath);
  const response = await axios.get(url, { headers: await getAuthHeaders(), params: isAll ? { search } : params });
  if (isAll) {
    const rows = response.data as Employee[];
    return { count: rows.length, next: null, previous: null, current_page: 1, total_pages: 1, results: rows };
  }
  return response.data as PaginatedResponses<Employee>;
};

export const getEmployeeById = async (id: number) => {
  return (await axios.get(createApiUrl(`${basePath}${id}/`), { headers: await getAuthHeaders() })).data;
};

export const updateEmployee = async (id: number, data: Partial<Employee>) => {
  return (await axios.put(createApiUrl(`${basePath}${id}/`), data, { headers: await getAuthHeaders() })).data;
};

export const deleteEmployee = async (id: number) => {
  return (await axios.delete(createApiUrl(`${basePath}${id}/`), { headers: await getAuthHeaders() })).data;
};
