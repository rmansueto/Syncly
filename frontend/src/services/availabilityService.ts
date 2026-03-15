import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
const client = axios.create({ baseURL: API_URL });

const token = localStorage.getItem("token");
if (token) client.defaults.headers.common["Authorization"] = `Bearer ${token}`;

export interface AvailabilityPayload {
  organizerId: number;
  dayOfWeek?: number; // 1..7
  startTime?: string; // "HH:mm:ss" or "HH:mm"
  endTime?: string;
  // one-off:
  startDateTime?: string;
  endDateTime?: string;
}

export const createAvailability = async (payload: AvailabilityPayload) => {
  const resp = await client.post("/availability", payload);
  return resp.data;
};

export const fetchAvailabilitySlots = async (meetingTypeId: number, from: string, to: string) => {
  const resp = await client.get(`/availability/slots?meetingTypeId=${meetingTypeId}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
  return resp.data as string[]; // ISO offset datetimes
};