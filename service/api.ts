import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Access-Control-Allow-Origin": "*",
    Accept: "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  let token = null;
  if (typeof window !== "undefined") {
    token = sessionStorage.getItem("auth_token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
  }
  return config;
});

export default api;

