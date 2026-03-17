import client from "./api";

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

export const updateAvailability = async (id: number, payload: AvailabilityPayload) => {
  const resp = await client.put(`/availability/${id}`, payload);
  return resp.data;
};

export const deleteAvailability = async (id: number) => {
  const resp = await client.delete(`/availability/${id}`);
  return resp.data;
};