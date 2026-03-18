import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Added for back button
import client from "../services/api";
import { ArrowLeftIcon, CameraIcon, UserIcon } from "@heroicons/react/24/outline";

interface User {
  id: number;
  fullName: string;
  email: string;
  photoUrl?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await client.get("/users/me");
        setUser(res.data);
        setFullName(res.data.fullName || "");
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const formData = new FormData();
    formData.append("fullName", fullName);
    if (photo) formData.append("photo", photo);

    try {
      const res = await client.put("/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(res.data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors mb-6 group"
      >
        <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Dashboard</span>
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Decorative Header Area */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

        <div className="px-8 pb-8">
          <div className="relative flex justify-center -mt-16 mb-8">
            <div className="relative group">
              <img
                src={photo ? URL.createObjectURL(photo) : user?.photoUrl || "https://ui-avatars.com/api/?name=" + (fullName || "User")}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md bg-white"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all scale-90 group-hover:scale-100"
                title="Change Photo"
              >
                <CameraIcon className="h-5 w-5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*" 
                onChange={handlePhotoChange} 
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">{user?.fullName || "Update Profile"}</h2>
            <p className="text-gray-500">{user?.email}</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:bg-indigo-300 transition-all shadow-md shadow-indigo-100 flex justify-center items-center"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : "Save Changes"}
              </button>
              
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;