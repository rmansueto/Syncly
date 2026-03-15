import React, { useEffect, useState } from "react";
import { fetchMeetingTypes } from "../services/meetingService";
import { createAvailability, fetchAvailabilitySlots } from "../services/availabilityService";

export default function Availability() {
  const [meetingTypes, setMeetingTypes] = useState<any[]>([]);
  const [organizerId, setOrganizerId] = useState<number | "">("");
  const [dayOfWeek, setDayOfWeek] = useState<number>(1);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedMeetingType, setSelectedMeetingType] = useState<number | "">("");
  const [from, setFrom] = useState<string>(() => new Date().toISOString().slice(0,19));
  const [to, setTo] = useState<string>(() => {
    const d = new Date(); d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0,19);
  });
  const [error, setError] = useState("");

  const loadMeetingTypes = async () => {
    try {
      const data = await fetchMeetingTypes();
      setMeetingTypes(data);
    } catch (e:any) {
      setError(e?.response?.data?.message || e.message || "Failed to load meeting types");
    }
  };

  useEffect(() => { loadMeetingTypes(); }, []);

  const handleCreateAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!organizerId) { setError("OrganizerId required"); return; }
    try {
      await createAvailability({
        organizerId: Number(organizerId),
        dayOfWeek,
        startTime: startTime,
        endTime: endTime
      });
      alert("Availability created");
    } catch (e:any) {
      setError(e?.response?.data?.message || e.message || "Create availability failed");
    }
  };

  const handleFetchSlots = async () => {
    setError("");
    if (!selectedMeetingType) { setError("Choose a meeting type"); return; }
    try {
      // convert from/to to OffsetDateTime strings: use Z (local offset might differ)
      const fromIso = new Date(from).toISOString();
      const toIso = new Date(to).toISOString();
      const data = await fetchAvailabilitySlots(Number(selectedMeetingType), fromIso, toIso);
      setSlots(data);
    } catch (e:any) {
      setError(e?.response?.data?.message || e.message || "Failed to fetch slots");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Availability</h1>
      {error && <div className="text-red-600 mb-3">{error}</div>}

      <form onSubmit={handleCreateAvailability} className="mb-6 space-y-3">
        <div>
          <label className="block text-sm">Organizer Id</label>
          <input value={organizerId} onChange={e => setOrganizerId(e.target.value === "" ? "" : Number(e.target.value))} className="border p-2 w-40" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm">Day of week (1=Mon)</label>
            <input type="number" min={1} max={7} value={dayOfWeek} onChange={e=>setDayOfWeek(Number(e.target.value))} className="border p-2 w-full" />
          </div>
          <div>
            <label className="block text-sm">Start</label>
            <input value={startTime} onChange={e=>setStartTime(e.target.value)} className="border p-2 w-full" />
          </div>
          <div>
            <label className="block text-sm">End</label>
            <input value={endTime} onChange={e=>setEndTime(e.target.value)} className="border p-2 w-full" />
          </div>
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Create availability</button>
      </form>

      <div className="mb-6">
        <h2 className="font-medium mb-2">Find slots</h2>
        <div className="grid grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-sm">Meeting type</label>
            <select value={selectedMeetingType} onChange={e=>setSelectedMeetingType(e.target.value === "" ? "" : Number(e.target.value))} className="border p-2 w-full">
              <option value="">Choose</option>
              {meetingTypes.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm">From (local)</label>
            <input type="datetime-local" value={from} onChange={e=>setFrom(e.target.value)} className="border p-2 w-full" />
          </div>
          <div>
            <label className="block text-sm">To (local)</label>
            <input type="datetime-local" value={to} onChange={e=>setTo(e.target.value)} className="border p-2 w-full" />
          </div>
          <div>
            <button onClick={handleFetchSlots} className="bg-indigo-600 text-white px-4 py-2 rounded">Get slots</button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">Slots</h3>
        {slots.length === 0 && <div className="text-sm text-slate-500">No slots</div>}
        <ul className="space-y-2">
          {slots.map((s, i) => (
            <li key={i} className="p-2 border rounded">
              {new Date(s).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}