import React, { useEffect, useState } from "react";
import { fetchAvailabilityByOrganizer, saveAvailabilityBulk, AvailabilityPayload } from "../services/availabilityService";

export default function Availability() {
  const [weekly, setWeekly] = useState<Record<number, { start: string; end: string }[]>>({});
  const [timezone, setTimezone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const entries = await fetchAvailabilityByOrganizer();
        const map: Record<number, { start: string; end: string }[]> = {};
        for (let d = 0; d <= 6; d++) map[d] = [];
        let tz: string | undefined;
        for (const e of entries) {
          if (e.timezone) tz = e.timezone;
          map[e.dayOfWeek] = [...(map[e.dayOfWeek] || []), { start: e.startTime, end: e.endTime }];
        }
        setWeekly(map);
        if (tz) setTimezone(tz);
      } catch (e:any) {
        setError("Failed to load availability");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateSlot = (day:number, index:number, field:"start"|"end", value:string) => {
    setWeekly(prev => {
      const daySlots = [...(prev[day] || [])];
      daySlots[index] = { ...daySlots[index], [field]: value };
      return { ...prev, [day]: daySlots };
    });
  };

  const addSlot = (day:number) => {
    setWeekly(prev => ({ ...prev, [day]: [...(prev[day] || []), { start: "09:00", end: "17:00" }] }));
  };

  const removeSlot = (day:number, index:number) => {
    setWeekly(prev => {
      const daySlots = [...(prev[day] || [])];
      daySlots.splice(index, 1);
      return { ...prev, [day]: daySlots };
    });
  };

  const handleSave = async () => {
    try {
      const payload: AvailabilityPayload[] = [];
      Object.entries(weekly).forEach(([k, slots]) => {
        slots.forEach(s => payload.push({
          dayOfWeek: Number(k),
          startTime: s.start,
          endTime: s.end,
          timezone,
        }));
      });
      await saveAvailabilityBulk(payload);
      alert("Availability saved!");
    } catch (e:any) {
      setError("Failed to save availability");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Weekly Availability ({timezone})</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="grid gap-4">
        {Array.from({ length: 7 }).map((_, day) => (
          <div key={day} className="border p-3 rounded">
            <div className="font-semibold mb-2">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][day]}</div>
            {(weekly[day] || []).map((slot, idx) => (
              <div key={idx} className="flex gap-2 mb-1">
                <input
                  type="time"
                  value={slot.start}
                  onChange={e => updateSlot(day, idx, "start", e.target.value)}
                  className="border p-1 w-24"
                />
                <span className="self-center">-</span>
                <input
                  type="time"
                  value={slot.end}
                  onChange={e => updateSlot(day, idx, "end", e.target.value)}
                  className="border p-1 w-24"
                />
                <button onClick={() => removeSlot(day, idx)} className="text-red-500 px-2">✕</button>
              </div>
            ))}
            <button onClick={() => addSlot(day)} className="text-indigo-600 text-sm mt-1">+ Add slot</button>
          </div>
        ))}
      </div>
      <button onClick={handleSave} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded">Save Availability</button>
    </div>
  );
}