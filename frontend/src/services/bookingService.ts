import client from "./api";

export interface BookingPayload {
  meetingTypeId: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  email: string;
}

export interface ExistingBooking {
  id: number;
  meetingTypeId: number;
  date: string;
  time: string;
  email: string;
}

export const createBooking = async (payload: BookingPayload) => {
  const res = await client.post("/bookings", payload);
  return res.data;
};

export const fetchBookedSlots = async (meetingTypeId: number, date: string) => {
  const res = await client.get(
    `/bookings/meeting/${meetingTypeId}/date/${date}`
  );
  return res.data as ExistingBooking[];
};