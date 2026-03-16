import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
const client = axios.create({ baseURL: API_URL });

// attach token for every request (reads token from localStorage at request time)
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
}, (err) => Promise.reject(err));

export interface MeetingTypePayload {
  title: string;
  description?: string;
  durationMinutes: number;
  availableStart?: string; // "HH:mm"
  availableEnd?: string;   // "HH:mm"
  active?: boolean;
}

export const fetchMeetingTypes = async () => {
  const resp = await client.get("/meeting-types");
  return resp.data;
};

export const createMeetingType = async (payload: MeetingTypePayload) => {
  const resp = await client.post("/meeting-types", payload);
  return resp.data;
};

export const updateMeetingType = async (id: number, payload: MeetingTypePayload) => {
  const resp = await client.put(`/meeting-types/${id}`, payload);
  return resp.data;
};

export const deleteMeetingType = async (id: number) => {
  const resp = await client.delete(`/meeting-types/${id}`);
  return resp.data;
};