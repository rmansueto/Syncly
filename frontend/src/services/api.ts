import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true, // only if using cookies
});

// Attach token from localStorage for all requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default client;