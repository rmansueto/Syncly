import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMeetingTypes } from "../services/meetingService";
import { createBooking, fetchBookedSlots } from "../services/bookingService";
import {
  fetchAvailabilityByOrganizer,
  AvailabilityPayload,
} from "../services/availabilityService";
import { ArrowLeftIcon, ClockIcon, CalendarDaysIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

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

      const entries: AvailabilityPayload[] = await fetchAvailabilityByOrganizer();
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
    for (let i = 0; i < 14; i++) { // Showing 14 days for more interactivity
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
      slots.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
      m += duration;
      if (m >= 60) { h++; m -= 60; }
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

  if (!meetingType) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-pulse text-indigo-600 font-medium">Loading Scheduler...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="max-w-4xl mx-auto mb-6 flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        <span>Back</span>
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* LEFT COLUMN: Info */}
        <div className="w-full md:w-1/3 p-8 border-r border-gray-100 bg-white">
          <div className="flex items-center gap-2 text-gray-400 mb-4 text-sm font-bold uppercase tracking-widest">
            <CalendarDaysIcon className="h-5 w-5" />
            <span>Syncly Schedule</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{meetingType.title}</h1>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600 font-medium">
              <ClockIcon className="h-5 w-5 text-indigo-500" />
              <span>{meetingType.durationMinutes} mins</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <GlobeAltIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm">Philippines Standard Time</span>
            </div>
          </div>
          <p className="mt-6 text-gray-500 leading-relaxed">
            {meetingType.description || "Select a date and time that works best for you to hop on a call."}
          </p>
        </div>

        {/* RIGHT COLUMN: Selection */}
        <div className="flex-1 p-8">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Select a Date & Time</h2>
          
          {/* Horizontal Date Picker */}
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {weekDates.map((d) => {
              const dateStr = d.toISOString().slice(0, 10);
              const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
              const dayNum = d.getDate();
              const isSelected = selectedDate === dateStr;
              const hasAvailability = weeklyAvailability[d.getDay()]?.length > 0;

              return (
                <button
                  key={dateStr}
                  disabled={!hasAvailability}
                  onClick={() => { setSelectedDate(dateStr); setSelectedTime(""); }}
                  className={`flex-shrink-0 w-16 h-20 flex flex-col items-center justify-center rounded-xl border-2 transition-all
                    ${isSelected ? "border-indigo-600 bg-indigo-50" : "border-gray-100 bg-white hover:border-indigo-200"}
                    ${!hasAvailability ? "opacity-30 cursor-not-allowed bg-gray-50 border-transparent" : ""}
                  `}
                >
                  <span className={`text-xs uppercase font-bold ${isSelected ? "text-indigo-600" : "text-gray-400"}`}>{dayName}</span>
                  <span className={`text-xl font-bold ${isSelected ? "text-indigo-600" : "text-gray-800"}`}>{dayNum}</span>
                </button>
              );
            })}
          </div>

          {/* Time Slots Area */}
          <div className="mt-8">
            {selectedDate ? (
              <>
                <p className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Available Times</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {weeklyAvailability[new Date(selectedDate).getDay()]
                    ?.flatMap((r: any) => getSlots(r.start, r.end, meetingType.durationMinutes))
                    .map((t: string) => {
                      const isTaken = bookedTimes.includes(t);
                      const isSelectedTime = selectedTime === t;
                      return (
                        <button
                          key={t}
                          disabled={isTaken}
                          onClick={() => setSelectedTime(t)}
                          className={`py-3 px-4 rounded-lg font-bold transition-all border
                            ${isSelectedTime ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-indigo-600 border-indigo-100 hover:border-indigo-600"}
                            ${isTaken ? "bg-gray-100 text-gray-300 border-transparent cursor-not-allowed" : ""}
                          `}
                        >
                          {t}
                        </button>
                      );
                    })}
                </div>
                {selectedTime && (
                  <div className="mt-10 flex justify-center"> 
                    <button
                      onClick={() => setShowModal(true)}
                      className="w-full max-w-xs bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5 active:scale-95"
                    >
                      Confirm Selection
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
                <CalendarDaysIcon className="h-10 w-10 mb-2 opacity-20" />
                <p>Please select a date to see availability</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-modal-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Final Step</h2>
            <p className="text-gray-500 text-center mb-6">
              Booking <span className="text-indigo-600 font-bold">{meetingType.title}</span> on {new Date(selectedDate).toLocaleDateString()} at {selectedTime}.
            </p>

            <label className="block text-sm font-bold text-gray-700 mb-2">YOUR EMAIL ADDRESS</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-6 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />

            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirmBooking}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all"
              >
                Confirm Booking
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-50 text-gray-500 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all"
              >
                Go Back
              </button>
            </div>
            {error && <div className="text-red-500 mt-4 text-center text-sm font-medium">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
}