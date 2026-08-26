import { jwtDecode } from 'jwt-decode';

// Global type declaration for API_URL
declare const __API_URL__: string;

// Type definitions
interface JwtPayload {
  exp: number;
  [key: string]: any;
}

interface RefreshTokenResponse {
  access: string;
}

interface CurrentUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
  user: CurrentUser;
}

interface AuthHeaders {
  'Content-Type': string;
  'Authorization': string;
  [key: string]: string;
}

interface FileUploadHeaders {
  'Content-Type': string;
  'Authorization': string;
  [key: string]: string;
}

const API_URL: string = __API_URL__;

const createApiUrl = (path: string): string => {
  const url = `${API_URL}${path}`;
  return url;
};

const getAuthHeaders = async (): Promise<AuthHeaders> => {
  let access_token: string | null = localStorage.getItem('access');
  let refresh_token: string | null = localStorage.getItem('refresh');

  if (isAccessTokenExpired(access_token)) {
    try {
      const newAccessToken = await refreshAccessToken(refresh_token);
      access_token = newAccessToken;
      localStorage.setItem('access', newAccessToken);
    } catch (error) {
      throw error;
    }
  }

  const headers: AuthHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`,
  };
  return headers;
};

const getAuthHeadersFile = async (): Promise<FileUploadHeaders> => {
  let access_token: string | null = localStorage.getItem('access');
  let refresh_token: string | null = localStorage.getItem('refresh');

  if (isAccessTokenExpired(access_token)) {
    const newAccessToken = await refreshAccessToken(refresh_token);
    access_token = newAccessToken;
    localStorage.setItem('access', newAccessToken);
  }

  const headers: FileUploadHeaders = {
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${access_token}`,
  };
  return headers;
};

const isAccessTokenExpired = (access_token: string | null): boolean => {
  if (!access_token) {
    return true;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(access_token);
    const currentTime = Date.now() / 1000;
    // Buffer of 10 seconds
    const isExpired = decoded.exp < (currentTime + 10);
    return isExpired;
  } catch (error) {
    return true;
  }
};

const refreshAccessToken = async (refresh_token: string | null): Promise<string> => {
  if (!refresh_token) {
    console.error("No refresh token found in localStorage.");
    throw new Error('No refresh token available. Please log in again.');
  }

  const refreshUrl = createApiUrl('api/token/refresh/');

  const response = await fetch(refreshUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh: refresh_token,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Refresh API returned error:", response.status, data);
    throw new Error(data.message || data.detail || 'Failed to refresh access token');
  }

  const accessToken = data.access;

  if (!accessToken) {
    console.error("Refresh API returned 200 but no access token was found in body:", data);
    throw new Error('No access token received in response');
  }

  return accessToken;
};

const login = async (username: string, password: string): Promise<CurrentUser> => {
  const response = await fetch(createApiUrl('api/token/'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.message || 'Invalid username or password');
  }

  const loginData = data as LoginResponse;
  localStorage.setItem('access', loginData.access);
  localStorage.setItem('refresh', loginData.refresh);
  localStorage.setItem('user', JSON.stringify(loginData.user));
  return loginData.user;
};

const logout = (): void => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('user');
};

const isLoggedIn = (): boolean => {
  return !!localStorage.getItem('refresh');
};

const getCurrentUser = (): CurrentUser | null => {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CurrentUser;
  } catch {
    return null;
  }
};

export { createApiUrl, getAuthHeaders, getAuthHeadersFile, login, logout, isLoggedIn, getCurrentUser };
export type { AuthHeaders, FileUploadHeaders, JwtPayload, RefreshTokenResponse, CurrentUser, LoginResponse };
