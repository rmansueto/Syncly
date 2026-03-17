import axios from "axios";

export interface BookingPayload {
  meetingTypeId: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

export const createBooking = async (payload: BookingPayload) => {
  try {
    const response = await axios.post("/api/bookings", payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (err: any) {
    throw err;
  }
};