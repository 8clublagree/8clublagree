import axios from "axios";
import { supabase } from "./supabase";

const axiosApi = axios.create({
  baseURL: "/api",
  withCredentials: false,
  timeout: 30_000, // Fail fast; avoid hanging requests (cost + UX)
});

// Session cache — fewer Supabase getSession() calls per request
const SESSION_CACHE_TTL_MS = 45_000;
let sessionCache: { token: string; expires: number } | null = null;

axiosApi.interceptors.request.use(
  async (config) => {
    const now = Date.now();
    if (sessionCache && sessionCache.expires > now) {
      config.headers.Authorization = `Bearer ${sessionCache.token}`;
      return config;
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      sessionCache = {
        token: session.access_token,
        expires: now + SESSION_CACHE_TTL_MS,
      };
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosApi;
