import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMeetingTypes } from "../services/meetingService";
import { createBooking, fetchBookedSlots } from "../services/bookingService";
import {
  fetchAvailabilityByOrganizer,
  AvailabilityPayload,
} from "../services/availabilityService";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meetingType, setMeetingType] = useState<any>(null);
  const [weeklyAvailability, setWeeklyAvailability] = useState<any>({});
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const types = await fetchMeetingTypes();
      const mt = types.find((m: any) => m.id === Number(id));
      setMeetingType(mt);

      const entries: AvailabilityPayload[] =
        await fetchAvailabilityByOrganizer();

      const map: any = {};
      for (let d = 0; d < 7; d++) map[d] = [];

      for (const e of entries) {
        if (e.dayOfWeek != null) {
          const start = (e.startTime ?? "09:00").slice(0, 5);
          const end = (e.endTime ?? "17:00").slice(0, 5);
          map[e.dayOfWeek].push({ start, end });
        }
      }
      setWeeklyAvailability(map);

      generateWeekDates(new Date());
    })();
  }, [id]);

  // Fetch booked slots when date changes
  useEffect(() => {
    if (!selectedDate || !meetingType) return;

    (async () => {
      const bookings = await fetchBookedSlots(meetingType.id, selectedDate);
      const times = bookings.map((b) => b.time.slice(0, 5));
      setBookedTimes(times);
    })();
  }, [selectedDate, meetingType]);

  const generateWeekDates = (current: Date) => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(current);
      d.setDate(current.getDate() + i);
      days.push(d);
    }
    setWeekDates(days);
  };

  const getSlots = (start: string, end: string, duration: number) => {
    const slots: string[] = [];
    let [h, m] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    while (h < eh || (h === eh && m + duration <= em)) {
      slots.push(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
      );
      m += duration;
      if (m >= 60) {
        h++;
        m -= 60;
      }
    }
    return slots;
  };

  const handleConfirmBooking = async () => {
    try {
      await createBooking({
        meetingTypeId: meetingType.id,
        date: selectedDate,
        time: selectedTime,
        email,
      });
      alert("Booking confirmed!");
      navigate("/");
    } catch (e: any) {
      setError(e?.message || "Booking failed");
    }
  };

  if (!meetingType) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold">{meetingType.title}</h1>
      <p>{meetingType.description}</p>
      <p>{meetingType.durationMinutes} mins</p>

      {/* DATE */}
      <div className="grid grid-cols-7 gap-2 mt-4">
        {weekDates.map((d) => {
          const dateStr = d.toISOString().slice(0, 10);
          const day = d.getDay();
          const disabled = weeklyAvailability[day]?.length === 0;
          return (
            <button
              key={dateStr}
              disabled={disabled}
              onClick={() => {
                setSelectedDate(dateStr);
                setSelectedTime("");
              }}
              className={`p-2 border rounded
                ${selectedDate === dateStr ? "bg-indigo-600 text-white" : ""}
                ${disabled ? "opacity-30" : ""}`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>

      {/* TIME */}
      {selectedDate && (
        <div className="grid grid-cols-4 gap-2 mt-4">
          {weeklyAvailability[new Date(selectedDate).getDay()]
            ?.flatMap((r: any) =>
              getSlots(r.start, r.end, meetingType.durationMinutes)
            )
            .map((t: string) => {
              const taken = bookedTimes.includes(t);
              return (
                <button
                  key={t}
                  disabled={taken}
                  onClick={() => setSelectedTime(t)}
                  className={`border p-2 rounded
                    ${selectedTime === t ? "bg-indigo-600 text-white" : ""}
                    ${taken ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "hover:bg-indigo-50"}
                  `}
                >
                  {t}
                </button>
              );
            })}
        </div>
      )}

      {/* BOOK BUTTON */}
      {selectedTime && (
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Book
        </button>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-80">
            <h2 className="font-semibold mb-2">Confirm Booking</h2>
            <p className="text-sm mb-2">
              {selectedDate} at {selectedTime}
            </p>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full mb-3"
            />

            <div className="flex gap-2">
              <button
                onClick={handleConfirmBooking}
                className="bg-indigo-600 text-white px-3 py-2 rounded"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="border px-3 py-2 rounded"
              >
                Cancel
              </button>
            </div>

            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
}