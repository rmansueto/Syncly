import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
const client = axios.create({ baseURL: API_URL });

// attach token for every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export interface AvailabilityPayload {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  startDateTime?: string;
  endDateTime?: string;
  timezone?: string;
}

export const createAvailability = async (payload: AvailabilityPayload) => {
  const resp = await client.post("/availability", payload);
  return resp.data;
};

export const bulkReplaceAvailability = async (payload: AvailabilityPayload[], timezone?: string) => {
  const tzQuery = timezone ? `?timezone=${encodeURIComponent(timezone)}` : "";
  const resp = await client.post(`/availability/bulk${tzQuery}`, payload);
  return resp.data as AvailabilityPayload[];
};

export const fetchAvailabilityByOrganizer = async () => {
  const resp = await client.get(`/availability`);
  return resp.data as AvailabilityPayload[];
};

export const fetchAvailabilitySlots = async (meetingTypeId: number, from: string, to: string) => {
  const resp = await client.get(`/availability/slots?meetingTypeId=${meetingTypeId}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
  return resp.data as string[];
};