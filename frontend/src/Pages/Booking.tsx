import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMeetingTypes } from "../services/meetingService";
import { createBooking } from "../services/bookingService";
import { fetchAvailabilityByOrganizer, AvailabilityPayload } from "../services/availabilityService";

interface MeetingType {
  id: number;
  title: string;
  description: string;
  durationMinutes: number;
  availableStart?: string;
  availableEnd?: string;
  active: boolean;
}

export default function Booking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [meetingType, setMeetingType] = useState<MeetingType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [weeklyAvailability, setWeeklyAvailability] = useState<Record<number, { start: string; end: string }[]>>(() => {
    const init: Record<number, { start: string; end: string }[]> = {};
    for (let d = 1; d <= 7; d++) init[d] = [];
    return init;
  });
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [weekDates, setWeekDates] = useState<Date[]>([]);

  useEffect(() => {
    (async () => {
      try {
        // Load meeting type
        const types = await fetchMeetingTypes();
        const mt = types.find((m: MeetingType) => m.id === Number(id));
        if (!mt) throw new Error("Meeting type not found");
        setMeetingType(mt);
        generateWeekDates(new Date());

        // Load weekly availability safely
        const entries: AvailabilityPayload[] = await fetchAvailabilityByOrganizer();
        const map: Record<number, { start: string; end: string }[]> = {};
        for (let d = 1; d <= 7; d++) map[d] = [];

        for (const e of entries) {
          if (e.dayOfWeek != null) {
            // fallback to default if undefined
            const start = (e.startTime ?? "09:00").slice(0, 5);
            const end = (e.endTime ?? "17:00").slice(0, 5);
            map[e.dayOfWeek] = [...(map[e.dayOfWeek] || []), { start, end }];
          }
        }

        setWeeklyAvailability(map);
      } catch (e: any) {
        setError(e?.message || "Failed to load meeting type or availability");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const generateWeekDates = (current: Date) => {
    const week: Date[] = [];
    const day = current.getDay(); // 0 = Sun
    for (let i = 1; i <= 7; i++) {
      const diff = i - day;
      const d = new Date(current);
      d.setDate(current.getDate() + diff);
      week.push(d);
    }
    setWeekDates(week);
  };

  const getTimeSlots = (start: string, end: string, duration: number) => {
    const slots: string[] = [];
    let [h, m] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    while (h < endH || (h === endH && m + duration <= endM)) {
      slots.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
      m += duration;
      if (m >= 60) {
        h += 1;
        m -= 60;
      }
    }
    return slots;
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      setError("Select a date and time");
      return;
    }
    try {
      await createBooking({
        meetingTypeId: meetingType!.id,
        date: selectedDate,
        time: selectedTime,
      });
      alert("Booking successful!");
      navigate("/");
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || "Booking failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!meetingType) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">{meetingType.title}</h1>
      <p className="text-sm text-slate-600 mb-1">{meetingType.description}</p>
      <p className="text-sm text-slate-600 mb-4">Duration: {meetingType.durationMinutes} minutes</p>

      <div className="mb-4">
        <div className="text-sm font-medium mb-2">Select a date</div>
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((d) => {
            const dateStr = d.toISOString().slice(0, 10);
            const dayNum = d.getDay();
            const availableRanges = weeklyAvailability[dayNum] || [];
            const isDisabled = availableRanges.length === 0;
            const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayNum];
            return (
              <button
                key={dateStr}
                onClick={() => !isDisabled && (setSelectedDate(dateStr), setSelectedTime(""))}
                disabled={isDisabled}
                className={`p-2 border rounded text-sm ${selectedDate === dateStr ? "bg-indigo-600 text-white" : ""} ${isDisabled ? "opacity-30 cursor-not-allowed" : ""}`}
              >
                <div>{dayName}</div>
                <div>{d.getDate()}</div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && weeklyAvailability[new Date(selectedDate).getDay()]?.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Available time slots</div>
          <div className="grid grid-cols-4 gap-2">
            {weeklyAvailability[new Date(selectedDate).getDay()]!.flatMap(range =>
              getTimeSlots(range.start, range.end, meetingType.durationMinutes)
            ).map(slot => (
              <button
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className={`p-2 border rounded text-sm ${selectedTime === slot ? "bg-indigo-600 text-white" : ""}`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button onClick={handleBooking} className="bg-indigo-600 text-white px-4 py-2 rounded">
          Book
        </button>
        <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">
          Cancel
        </button>
      </div>

      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  );
}