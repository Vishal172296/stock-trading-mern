import axios from "axios";

// Read API URL from environment variable or fallback to localhost
const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3002";

const api = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor to attach JWT token and User ID
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (userId) {
      config.headers["x-user-id"] = userId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
export { BASE_URL };
