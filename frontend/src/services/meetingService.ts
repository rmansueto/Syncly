import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
const client = axios.create({ baseURL: API_URL });

const token = localStorage.getItem("token");
if (token) client.defaults.headers.common["Authorization"] = `Bearer ${token}`;

export interface MeetingTypePayload {
  title: string;
  description?: string;
  durationMinutes: number;
  organizerId?: number;
  availableStart?: string; // "HH:mm"
  availableEnd?: string;   // "HH:mm"
}

export const fetchMeetingTypes = async (organizerId?: number) => {
  const url = organizerId ? `/meeting-types?organizerId=${organizerId}` : "/meeting-types";
  const resp = await client.get(url);
  return resp.data;
};

export const createMeetingType = async (payload: MeetingTypePayload) => {
  const resp = await client.post("/meeting-types", payload);
  return resp.data;
};