import React, { useEffect, useState } from "react";
import {
  fetchMeetingTypes,
  createMeetingType,
  updateMeetingType,
  deleteMeetingType,
  MeetingTypePayload,
} from "../services/meetingService";
import { Link } from "react-router-dom";
import { 
  PlusIcon, 
  EllipsisVerticalIcon, 
  ClockIcon, 
  LinkIcon, 
  CalendarIcon,
  TrashIcon,
  PencilSquareIcon,
  XMarkIcon,
  CheckIcon
} from "@heroicons/react/24/outline";

export default function MeetingTypes() {
  const [list, setList] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState<number>(30);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [description, setDescription] = useState("");
  const [useWorkingHours, setUseWorkingHours] = useState(true);

  const load = async () => {
    try {
      const data = await fetchMeetingTypes();
      setList(data.filter((m: any) => m.active !== false));
    } catch (e: any) {
      setError("Failed to load meeting types");
    }
  };

  useEffect(() => { load(); }, []);

  const handleCopyLink = (id: number) => {
    const url = `${window.location.origin}/booking/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openCreate = () => {
    setEditing(null); setTitle(""); setDuration(30); setDescription("");
    setUseWorkingHours(true); setDrawerOpen(true);
  };

  const openEdit = (m: any) => {
    setEditing(m); setTitle(m.title); setDuration(m.durationMinutes);
    setDescription(m.description); setStart(m.availableStart || "09:00");
    setEnd(m.availableEnd || "17:00"); setUseWorkingHours(!m.availableStart);
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload: MeetingTypePayload = {
        title, description, durationMinutes: duration,
        availableStart: useWorkingHours ? undefined : start,
        availableEnd: useWorkingHours ? undefined : end,
        active: true,
      };
      editing ? await updateMeetingType(editing.id, payload) : await createMeetingType(payload);
      setDrawerOpen(false); load();
    } catch (e) { setError("Save failed"); }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Event Types</h1>
          <p className="text-slate-500 text-sm mt-1">Configure your availability and booking links.</p>
        </div>
        <button 
          onClick={openCreate} 
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-semibold transition-all shadow-md shadow-indigo-100 active:scale-95"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Event Type</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center justify-between rounded-r-lg">
          <span>{error}</span>
          <button onClick={() => setError("")}><XMarkIcon className="h-4 w-4"/></button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((m) => (
          <div key={m.id} className="group relative bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 overflow-hidden flex flex-col">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <CalendarIcon className="h-6 w-6" />
                </div>
                <div className="relative">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === m.id ? null : m.id); }}
                    className="p-1 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <EllipsisVerticalIcon className="h-5 w-5 text-slate-400" />
                  </button>
                  {openMenuId === m.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-xl z-20 py-1 animate-in zoom-in-95 duration-150">
                      <button onClick={() => openEdit(m)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                        <PencilSquareIcon className="h-4 w-4" /> Edit
                      </button>
                      <button onClick={() => deleteMeetingType(m.id).then(load)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <TrashIcon className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{m.title}</h3>
              <p className="text-slate-500 text-sm mt-1 line-clamp-2 min-h-[40px]">{m.description || "No description provided."}</p>
              
              <div className="mt-4 flex items-center gap-4 text-slate-400 text-sm font-medium">
                <div className="flex items-center gap-1.5">
                  <ClockIcon className="h-4 w-4" />
                  <span>{m.durationMinutes}m</span>
                </div>
                <span className="text-slate-200">|</span>
                <Link to={`/booking/${m.id}`} className="text-indigo-600 hover:underline decoration-2 underline-offset-4">View page</Link>
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
              <button 
                onClick={() => handleCopyLink(m.id)}
                className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${copiedId === m.id ? "text-emerald-600" : "text-slate-500 hover:text-indigo-600"}`}
              >
                {copiedId === m.id ? <CheckIcon className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                {copiedId === m.id ? "Copied!" : "Copy Link"}
              </button>
              <Link 
                to={`/booking/${m.id}`} 
                className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
              >
                Book
              </Link>
            </div>
          </div>
        ))}
        {/* Empty State */}
        {list.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <PlusIcon className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">No event types created yet.</p>
            <button onClick={openCreate} className="mt-4 text-indigo-600 font-bold hover:text-indigo-700 underline underline-offset-4">Create your first one</button>
          </div>
        )}
      </div>

      {/* Side Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-300">
              <div className="h-full flex flex-col p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">{editing ? "Edit Event" : "New Event"}</h2>
                  <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <XMarkIcon className="h-6 w-6 text-slate-400" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-hide">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Event Title</label>
                    <input 
                      placeholder="e.g. 15 Minute Discovery Call"
                      value={title} onChange={e=>setTitle(e.target.value)} 
                      className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-indigo-600 outline-none transition-all font-medium" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Duration (Minutes)</label>
                    <div className="flex gap-2">
                      {[15, 30, 45, 60].map(m => (
                        <button 
                          key={m} 
                          onClick={() => setDuration(m)}
                          className={`flex-1 py-2 rounded-lg border-2 font-bold transition-all ${duration === m ? "bg-indigo-50 border-indigo-600 text-indigo-600" : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Description</label>
                    <textarea 
                      rows={3}
                      value={description} onChange={e=>setDescription(e.target.value)} 
                      className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-indigo-600 outline-none transition-all resize-none" 
                    />
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input type="checkbox" className="sr-only peer" checked={useWorkingHours} onChange={e=>setUseWorkingHours(e.target.checked)} />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </div>
                      <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">Sync with Working Hours</span>
                    </label>
                    {!useWorkingHours && (
                      <div className="mt-4 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                        <input value={start} onChange={e=>setStart(e.target.value)} className="border-2 border-white rounded-lg p-2 text-center font-mono shadow-sm" />
                        <input value={end} onChange={e=>setEnd(e.target.value)} className="border-2 border-white rounded-lg p-2 text-center font-mono shadow-sm" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex gap-3">
                  <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95">
                    {editing ? "Update Event" : "Create Event Type"}
                  </button>
                  <button onClick={() => setDrawerOpen(false)} className="px-6 py-4 border-2 border-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}