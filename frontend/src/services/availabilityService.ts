import client from "./api";

export interface AvailabilityPayload {
  id?: number;
  dayOfWeek: number; // 0 = Sunday
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  timezone?: string;
}

export const fetchAvailabilityByOrganizer = async () => {
  const res = await client.get("/availability");
  return res.data as AvailabilityPayload[];
};

export const saveAvailabilityBulk = async (payload: AvailabilityPayload[]) => {
  const res = await client.post("/availability/bulk", payload);
  return res.data;
};