import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import client from "../services/api";
import { 
  ArrowLeftIcon, 
  CameraIcon, 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon 
} from "@heroicons/react/24/outline";

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
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    
    if (newPassword && newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append("fullName", fullName);
    if (newPassword) formData.append("newPassword", newPassword);
    if (photo) formData.append("photo", photo);

    try {
      const res = await client.put("/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(res.data);
      setNewPassword("");
      setConfirmPassword("");
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
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
            {/* Displayed Email (Unchangeable) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="block w-full pl-10 pr-3 py-3 border border-gray-100 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed sm:text-sm"
                />
              </div>
            </div>

            {/* Full Name */}
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all sm:text-sm"
                />
              </div>
            </div>

            {/* Password Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Leave blank to keep same"
                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all sm:text-sm"
                  />
                </div>
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