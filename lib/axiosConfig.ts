import axios from "axios";
import { supabase } from "./supabase";
import { store } from "./store";
import { logout as logoutAction } from "./features/authSlice";

const axiosApi = axios.create({
  baseURL: "/api",
  withCredentials: false,
  timeout: 30_000, // Fail fast; avoid hanging requests (cost + UX)
});

axiosApi.interceptors.request.use(
  async (config) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      // Same logic as AuthenticatedLayout handleLogout: sign out, clear Redux, redirect
      await supabase.auth.signOut();
      store.dispatch(logoutAction());
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosApi;
