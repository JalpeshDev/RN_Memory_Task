import axios from "axios";
import constant from "app/constants/constant";

const api = axios.create({
  baseURL: constant.supabase.url,
  timeout: 20000,
  headers: {
    Authorization: `Bearer ${constant.supabase.anonKey}`,
  },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.message ||
      err?.response?.data ||
      err?.message ||
      "Network error";
    return Promise.reject(new Error(message));
  }
);

export default api;
