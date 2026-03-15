import React, { useEffect, useState } from "react";
import { fetchMeetingTypes, createMeetingType, MeetingTypePayload } from "../services/meetingService";
import { useNavigate } from "react-router-dom";

export default function MeetingTypes() {
  const [list, setList] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState<number>(30);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    try {
      const data = await fetchMeetingTypes();
      setList(data);
    } catch (e:any) {
      setError(e?.response?.data?.message || e.message || "Failed to load meeting types");
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const payload: MeetingTypePayload = {
        title,
        durationMinutes: duration,
        availableStart: start,
        availableEnd: end,
      };
      await createMeetingType(payload);
      setTitle("");
      setDuration(30);
      setStart("09:00");
      setEnd("17:00");
      await load();
    } catch (e:any) {
      setError(e?.response?.data?.message || e.message || "Create failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Meeting Types</h1>
      {error && <div className="text-red-600 mb-3">{error}</div>}

      <form onSubmit={handleCreate} className="space-y-3 mb-6">
        <div>
          <label className="block text-sm">Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} className="border p-2 w-full" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm">Duration (minutes)</label>
            <input type="number" value={duration} onChange={e=>setDuration(Number(e.target.value))} className="border p-2 w-full" />
          </div>
          <div>
            <label className="block text-sm">Start (HH:mm)</label>
            <input value={start} onChange={e=>setStart(e.target.value)} className="border p-2 w-full" />
          </div>
          <div>
            <label className="block text-sm">End (HH:mm)</label>
            <input value={end} onChange={e=>setEnd(e.target.value)} className="border p-2 w-full" />
          </div>
        </div>

        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Create</button>
      </form>

      <div>
        <h2 className="text-xl font-medium mb-2">Existing</h2>
        <div className="grid gap-3">
          {list.length === 0 && <div className="text-sm text-slate-500">No meeting types yet.</div>}
          {list.map((m:any) => (
            <div key={m.id} className="p-3 border rounded flex justify-between items-center">
              <div>
                <div className="font-semibold">{m.title}</div>
                <div className="text-sm text-slate-600">{m.durationMinutes} min • {m.availableStart} - {m.availableEnd}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate(`/meeting-types/${m.id}`)} className="text-indigo-600">Open</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}