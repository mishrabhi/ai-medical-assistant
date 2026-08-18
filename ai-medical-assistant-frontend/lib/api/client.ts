import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshSubscribers: Array<{
  resolve: (token: string) => void;
  reject: (reason?: unknown) => void;
}> = [];

const onRefreshSuccess = (token: string) => {
  refreshSubscribers.forEach(({ resolve }) => resolve(token));
  refreshSubscribers = [];
};

const onRefreshFailed = (reason?: unknown) => {
  refreshSubscribers.forEach(({ reject }) => reject(reason));
  refreshSubscribers = [];
};

const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem("accessToken");
};

const setAccessToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) {
    window.sessionStorage.setItem("accessToken", token);
    return;
  }

  window.sessionStorage.removeItem("accessToken");
};

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshSubscribers.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }

              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await api.post<{ success: boolean; data: { accessToken: string } }>("/auth/refresh");
        const nextToken = refreshResponse.data?.data?.accessToken;

        if (!nextToken) {
          throw new Error("Missing access token from refresh response");
        }

        setAccessToken(nextToken);
        onRefreshSuccess(nextToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${nextToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        onRefreshFailed(refreshError);
        setAccessToken(null);

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const apiClient = api;
export default apiClient;
