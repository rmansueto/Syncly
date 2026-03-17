import client from "./api";

export interface MeetingTypePayload {
  title: string;
  description?: string;
  durationMinutes: number;
  availableStart?: string;
  availableEnd?: string;
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