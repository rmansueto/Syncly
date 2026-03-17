import React, { useEffect, useState } from "react";
import { fetchMeetingTypes } from "../services/meetingService";
import { bulkReplaceAvailability, fetchAvailabilityByOrganizer } from "../services/availabilityService";

const DAYS = [
  { id: 1, label: "Mon" },
  { id: 2, label: "Tue" },
  { id: 3, label: "Wed" },
  { id: 4, label: "Thu" },
  { id: 5, label: "Fri" },
  { id: 6, label: "Sat" },
  { id: 7, label: "Sun" },
];

const COMMON_TZ = [
  "UTC",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Manila",
  "Asia/Tokyo",
  "Australia/Sydney",
];

// Type for each time range
type TimeRange = {
  start: string;
  end: string;
};

export default function Availability() {
  const [meetingTypes, setMeetingTypes] = useState<any[]>([]);
  const [timezone, setTimezone] = useState<string>(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  const [weekly, setWeekly] = useState<Record<number, TimeRange[]>>(() => {
    const init: Record<number, TimeRange[]> = {};
    for (let d = 1; d <= 7; d++) init[d] = [];
    return init;
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch meeting types (if needed)
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMeetingTypes();
        setMeetingTypes(data);
      } catch (e:any) {}
    })();
  }, []);

  // Load existing availability for current user
  useEffect(() => {
    (async () => {
      try {
        const entries = await fetchAvailabilityByOrganizer();
        const map: Record<number, TimeRange[]> = {};
        for (let d = 1; d <= 7; d++) map[d] = [];

        let foundTz: string | undefined;
        for (const e of entries) {
          if (e.timezone) foundTz = e.timezone;

          if (e.dayOfWeek) {
            const start = (e.startTime || "09:00:00").slice(0,5);
            const end = (e.endTime || "17:00:00").slice(0,5);
            map[e.dayOfWeek] = [...(map[e.dayOfWeek] || []), { start, end }];
          }
        }
        setWeekly(map);
        if (foundTz) setTimezone(foundTz);
      } catch (e:any) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addRange = (day: number) => {
    setWeekly(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), { start: "09:00", end: "17:00" }]
    }));
  };

  const removeRange = (day: number, idx: number) => {
    setWeekly(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== idx)
    }));
  };

  const setRange = (day: number, idx: number, field: "start" | "end", value: string) => {
    setWeekly(prev => {
      const copy = { ...prev };
      copy[day] = copy[day].map((r, i) => i === idx ? { ...r, [field]: value } : r);
      return copy;
    });
  };

  const handleSaveWeekly = async () => {
    setError("");
    try {
      const payload = [];
      for (let day = 1; day <= 7; day++) {
        const ranges = weekly[day] || [];
        for (const r of ranges) {
          payload.push({
            dayOfWeek: day,
            startTime: r.start.length === 5 ? r.start + ":00" : r.start,
            endTime: r.end.length === 5 ? r.end + ":00" : r.end,
            timezone
          });
        }
      }
      await bulkReplaceAvailability(payload, timezone);
      alert("Weekly availability saved!");
    } catch (e:any) {
      setError(e?.response?.data?.message || e.message || "Save failed");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Weekly Availability</h1>
      {error && <div className="text-red-600 mb-3">{error}</div>}

      <div className="mb-4">
        <label className="block text-sm mb-1">Timezone</label>
        <select value={timezone} onChange={e=>setTimezone(e.target.value)} className="border p-2 w-60">
          <option value={timezone}>{timezone}</option>
          {COMMON_TZ.map(t => t !== timezone && <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="space-y-3 mb-4">
        {DAYS.map(d => (
          <div key={d.id} className="flex items-center gap-4">
            <div className="w-12 font-medium">{d.label}</div>
            <div className="flex gap-2 flex-1 flex-wrap">
              {(weekly[d.id] || []).map((r, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input type="time" value={r.start} onChange={e=>setRange(d.id, idx, "start", e.target.value)} className="border p-2" />
                  <span>-</span>
                  <input type="time" value={r.end} onChange={e=>setRange(d.id, idx, "end", e.target.value)} className="border p-2" />
                  <button onClick={()=>removeRange(d.id, idx)} className="text-sm text-red-600 px-2">Remove</button>
                </div>
              ))}
              <button onClick={()=>addRange(d.id)} className="text-sm text-indigo-600">+ Add</button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={handleSaveWeekly} className="bg-indigo-600 text-white px-4 py-2 rounded">Save Changes</button>
        <button onClick={() => {
          setWeekly(() => {
            const init: Record<number, TimeRange[]> = {};
            for (let d=1; d<=7; d++) init[d] = [];
            return init;
          });
        }} className="px-4 py-2 border rounded">Clear</button>
      </div>
    </div>
  );
}