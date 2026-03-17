import React, { useEffect, useState } from "react";
import {
  fetchMeetingTypes,
  createMeetingType,
  updateMeetingType,
  deleteMeetingType,
  MeetingTypePayload,
} from "../services/meetingService";
import { fetchAvailabilityByOrganizer } from "../services/availabilityService";
import { Link } from "react-router-dom";

export default function MeetingTypes() {
  const [list, setList] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null); // track which card menu is open

  // form state for drawer
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState<number>(30);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [description, setDescription] = useState("");
  const [useWorkingHours, setUseWorkingHours] = useState(true);
  const [weekly, setWeekly] = useState<Record<number, { start: string; end: string }[]>>(() => {
    const init: Record<number, { start: string; end: string }[]> = {};
    for (let d = 1; d <= 7; d++) init[d] = [];
    return init;
  });
  const [timezone, setTimezone] = useState<string>(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");

  const load = async () => {
    try {
      const data = await fetchMeetingTypes();
      const activeOnly = data.filter((m: any) => m.active !== false);
      setList(activeOnly);
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || "Failed to load meeting types");
    }
  };

  useEffect(() => { load(); }, []);

  // load current user's weekly availability
  useEffect(() => {
    (async () => {
      try {
        const entries = await fetchAvailabilityByOrganizer();
        const map: Record<number, { start: string; end: string }[]> = {};
        for (let d=1; d<=7; d++) map[d]=[];
        let foundTz: string | undefined;
        for (const e of entries) {
          if (e.timezone) foundTz = e.timezone;
          if (e.dayOfWeek) {
            const start = (e.startTime || "09:00:00").length === 8 ? e.startTime!.slice(0,5) : (e.startTime || "09:00");
            const end = (e.endTime || "17:00:00").length === 8 ? e.endTime!.slice(0,5) : (e.endTime || "17:00");
            map[e.dayOfWeek] = [...(map[e.dayOfWeek]||[]), { start, end }];
          }
        }
        setWeekly(map);
        if (foundTz) setTimezone(foundTz);
      } catch (e:any) {
        // ignore if not logged in or no availability
      }
    })();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setTitle("");
    setDuration(30);
    setStart("09:00");
    setEnd("17:00");
    setDescription("");
    setUseWorkingHours(true);
    setDrawerOpen(true);
  };

  const openEdit = (m: any) => {
    setEditing(m);
    setTitle(m.title || "");
    setDuration(m.durationMinutes || 30);
    setStart(m.availableStart || "09:00");
    setEnd(m.availableEnd || "17:00");
    setDescription(m.description || "");
    setUseWorkingHours(true);
    setDrawerOpen(true);
  };

  const handleCreateOrUpdate = async () => {
    setError("");
    try {
      const payload: MeetingTypePayload = {
        title,
        description,
        durationMinutes: duration,
        availableStart: useWorkingHours ? undefined : start,
        availableEnd: useWorkingHours ? undefined : end,
        active: true,
      };
      if (editing?.id) {
        await updateMeetingType(editing.id, payload);
      } else {
        await createMeetingType(payload);
      }
      setDrawerOpen(false);
      await load();
    } catch (e:any) {
      setError(e?.response?.data?.message || e.message || "Save failed");
    }
  };

  const handleDelete = async (id:number) => {
    if (!window.confirm("Delete this event type?")) return;
    try {
      await deleteMeetingType(id);
      await load();
    } catch (e:any) {
      setError(e?.response?.data?.message || e.message || "Delete failed");
    }
  };

  // helper to render availability summary
  const renderAvailabilitySummary = () => {
    return (
      <div className="text-sm text-slate-600">
        {Object.entries(weekly).map(([k, ranges]) => {
          if (!ranges || ranges.length === 0) return null;
          return (
            <div key={k} className="flex items-center gap-2">
              <div className="w-6 text-xs font-medium">{["","Mon","Tue","Wed","Thu","Fri","Sat","Sun"][Number(k)]}</div>
              <div className="text-xs">{ranges.map(r => `${r.start}-${r.end}`).join(", ")}</div>
            </div>
          );
        })}
        {Object.values(weekly).every(r => r.length === 0) && <div className="text-sm text-slate-500">No weekly hours set</div>}
      </div>
    );
  };

  // close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Event Types</h1>
        <div className="flex items-center gap-3">
          {error && <div className="text-red-600 mr-4">{error}</div>}
          <button onClick={openCreate} className="bg-indigo-600 text-white px-4 py-2 rounded">+ New Event Type</button>
        </div>
      </div>

      <div className="grid gap-4">
        {list.length === 0 && <div className="text-sm text-slate-500">No active event types yet.</div>}
        {list.map((m:any) => (
          <div key={m.id} className="group relative bg-white p-4 rounded shadow hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-lg">{m.title}</div>
                <div className="text-sm text-slate-600">{m.durationMinutes} min • {m.availableStart ?? "uses working hours"}</div>
                <div className="text-xs text-slate-400 mt-1">Host: You</div>
              </div>

              {/* Settings menu */}
              <div className="relative">
                <button
                  className="text-slate-500 hover:text-slate-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === m.id ? null : m.id);
                  }}
                >
                  ⋯
                </button>
                {openMenuId === m.id && (
                  <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow z-10">
                    <button onClick={() => openEdit(m)} className="w-full text-left px-3 py-2 hover:bg-slate-50">Edit</button>
                    <button onClick={() => handleDelete(m.id)} className="w-full text-left px-3 py-2 text-red-600 hover:bg-slate-50">Delete</button>
                  </div>
                )}
              </div>
            </div>

            {/* hover quick actions: Book / Share */}
            <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition flex gap-2">
              <Link to={`/booking/${m.id}`} className="bg-white border px-3 py-1 rounded shadow-sm text-sm hover:bg-slate-50">Book</Link>
              <button className="bg-white border px-3 py-1 rounded shadow-sm text-sm hover:bg-slate-50">Share</button>
            </div>
          </div>
        ))}
      </div>

      {/* Right drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1" onClick={() => setDrawerOpen(false)} />
          <div className="w-96 bg-white shadow-xl p-6 flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{editing ? "Edit Event Type" : "New Event Type"}</h2>
              <button onClick={() => setDrawerOpen(false)} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>

            <div className="mt-4 flex-1 overflow-auto">
              <div className="mb-3">
                <label className="block text-sm">Title</label>
                <input value={title} onChange={e=>setTitle(e.target.value)} className="border p-2 w-full" />
              </div>
              <div className="mb-3">
                <label className="block text-sm">Duration (minutes)</label>
                <input type="number" value={duration} onChange={e=>setDuration(Number(e.target.value))} className="border p-2 w-40" />
              </div>
              <div className="mb-3">
                <label className="block text-sm">Description</label>
                <textarea value={description} onChange={e=>setDescription(e.target.value)} className="border p-2 w-full h-24" />
              </div>

              <div className="mb-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={useWorkingHours} onChange={e=>setUseWorkingHours(e.target.checked)} />
                  Use my working hours
                </label>
                {!useWorkingHours && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm">Start (HH:mm)</label>
                      <input value={start} onChange={e=>setStart(e.target.value)} className="border p-2 w-full" />
                    </div>
                    <div>
                      <label className="block text-sm">End (HH:mm)</label>
                      <input value={end} onChange={e=>setEnd(e.target.value)} className="border p-2 w-full" />
                    </div>
                  </div>
                )}

                <div className="mt-3">
                  <div className="text-sm font-medium">Your weekly hours ({timezone})</div>
                  <div className="mt-2 text-xs text-slate-600">
                    {renderAvailabilitySummary()}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-sm">Host</label>
                <div className="mt-1 text-sm">You</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <button onClick={handleCreateOrUpdate} className="bg-indigo-600 text-white px-4 py-2 rounded">
                  {editing ? "Save" : "Create"}
                </button>
              </div>
              <div>
                <button onClick={() => setDrawerOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}