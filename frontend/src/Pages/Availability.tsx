import React, { useEffect, useState } from "react";
import { fetchAvailabilityByOrganizer, saveAvailabilityBulk, AvailabilityPayload } from "../services/availabilityService";
import { 
  ClockIcon, 
  PlusIcon, 
  TrashIcon, 
  GlobeAsiaAustraliaIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";

export default function Availability() {
  const [weekly, setWeekly] = useState<Record<number, { start: string; end: string }[]>>({});
  const [timezone, setTimezone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const entries = await fetchAvailabilityByOrganizer();
        const map: Record<number, { start: string; end: string }[]> = {};
        for (let d = 0; d <= 6; d++) map[d] = [];
        let tz: string | undefined;
        for (const e of entries) {
          if (e.timezone) tz = e.timezone;
          const s = (e.startTime || "09:00").slice(0, 5);
          const en = (e.endTime || "17:00").slice(0, 5);
          map[e.dayOfWeek] = [...(map[e.dayOfWeek] || []), { start: s, end: en }];
        }
        setWeekly(map);
        if (tz) setTimezone(tz);
      } catch (e: any) {
        setError("Failed to load availability settings.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateSlot = (day: number, index: number, field: "start" | "end", value: string) => {
    setWeekly(prev => {
      const daySlots = [...(prev[day] || [])];
      daySlots[index] = { ...daySlots[index], [field]: value };
      return { ...prev, [day]: daySlots };
    });
  };

  const addSlot = (day: number) => {
    setWeekly(prev => ({ ...prev, [day]: [...(prev[day] || []), { start: "09:00", end: "17:00" }] }));
  };

  const removeSlot = (day: number, index: number) => {
    setWeekly(prev => {
      const daySlots = [...(prev[day] || [])];
      daySlots.splice(index, 1);
      return { ...prev, [day]: daySlots };
    });
  };

  const handleSave = async () => {
    setError("");
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
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e: any) {
      setError("Failed to save changes. Please try again.");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-24 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Availability</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium flex items-center gap-1.5">
            <GlobeAsiaAustraliaIcon className="h-4 w-4" />
            Your schedule is currently in {timezone}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 flex items-center gap-3">
          <ExclamationCircleIcon className="h-5 w-5" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* Days List */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        {Array.from({ length: 7 }).map((_, day) => {
          const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day];
          const slots = weekly[day] || [];
          const isAvailable = slots.length > 0;

          return (
            <div key={day} className={`flex flex-col md:flex-row border-b border-slate-100 last:border-0 p-6 transition-colors ${!isAvailable ? 'bg-slate-50/50' : ''}`}>
              {/* Day Label */}
              <div className="w-full md:w-40 mb-4 md:mb-0 flex items-center">
                <span className={`font-bold text-sm tracking-wide uppercase ${isAvailable ? 'text-slate-900' : 'text-slate-400'}`}>
                  {dayName}
                </span>
              </div>

              {/* Slots Area */}
              <div className="flex-1">
                {isAvailable ? (
                  <div className="space-y-3">
                    {slots.map((slot, idx) => (
                      <div key={idx} className="flex items-center gap-3 animate-in slide-in-from-left-2 duration-200">
                        <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm focus-within:border-indigo-600 transition-all">
                          <input
                            type="time"
                            value={slot.start}
                            onChange={e => updateSlot(day, idx, "start", e.target.value)}
                            className="text-sm font-semibold outline-none bg-transparent"
                          />
                          <span className="mx-2 text-slate-300">—</span>
                          <input
                            type="time"
                            value={slot.end}
                            onChange={e => updateSlot(day, idx, "end", e.target.value)}
                            className="text-sm font-semibold outline-none bg-transparent"
                          />
                        </div>
                        <button 
                          onClick={() => removeSlot(day, idx)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => addSlot(day)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 p-1"
                    >
                      <PlusIcon className="h-3.5 w-3.5" />
                      Add Interval
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center h-full">
                    <button 
                      onClick={() => addSlot(day)}
                      className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
                    >
                      Unavailable
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-40">
        <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl flex items-center justify-between border border-white/10">
          <div className="flex items-center gap-3">
            {saveSuccess ? (
              <div className="flex items-center gap-2 text-emerald-400 animate-in zoom-in duration-300">
                <CheckCircleIcon className="h-5 w-5" />
                <span className="text-sm font-bold">Changes Saved!</span>
              </div>
            ) : (
              <div className="text-slate-400 flex items-center gap-2">
                <ClockIcon className="h-5 w-5" />
                <span className="text-xs font-medium">Auto-save is off</span>
              </div>
            )}
          </div>
          <button 
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}