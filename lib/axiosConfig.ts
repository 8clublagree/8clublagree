import axios from "axios";
import { supabase } from "./supabase";

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

export default axiosApi;
