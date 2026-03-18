import React, { JSX, useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import client from "../services/api";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ArrowsRightLeftIcon,
  Squares2X2Icon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";

interface User {
  id: number;
  fullName: string;
  email: string;
  photoUrl?: string; // Added photoUrl to the interface
}

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Fetch user info from API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await client.get("/users/me");
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path: string) => {
    const p = location.pathname.replace(/\/+$/, "");
    if (path === "meeting-types") {
      return p === "/dashboard" || p === "/dashboard/meeting-types";
    }
    return p.startsWith(`/dashboard/${path}`);
  };

  const navBtn = (label: string, icon: JSX.Element, path?: string, onClick?: () => void) => {
    const active = path ? isActive(path) : false;
    const base = "flex items-center gap-3 p-2 rounded";
    const hover = "hover:bg-indigo-100";
    const activeClasses = active ? "bg-indigo-100 font-semibold" : "";
    return (
      <button
        onClick={onClick ?? (() => navigate(path ?? ""))}
        className={`${base} ${hover} ${activeClasses}`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8 text-indigo-600">Syncly</h1>

        <nav className="flex flex-col gap-4 flex-1">
          {navBtn("Meeting Types", <CalendarIcon className="h-5 w-5" />, "meeting-types")}
          {navBtn("Meetings", <ClockIcon className="h-5 w-5" />, "meeting-types")}
          {navBtn("Availability", <UserIcon className="h-5 w-5" />, "availability")}
          {navBtn("Contacts", <ArrowsRightLeftIcon className="h-5 w-5" />)}
          {navBtn("Workflows", <Squares2X2Icon className="h-5 w-5" />)}
          <button className="flex items-center gap-3 p-2 hover:bg-indigo-100 rounded">
            <Cog6ToothIcon className="h-5 w-5" />
            Integrations
          </button>
          <button className="flex items-center gap-3 p-2 hover:bg-indigo-100 rounded">
            <ChartBarIcon className="h-5 w-5" />
            Analytics
          </button>
          <button className="flex items-center gap-3 p-2 hover:bg-indigo-100 rounded">
            <QuestionMarkCircleIcon className="h-5 w-5" />
            Help
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col">
        {/* Top Bar */}
        <div className="flex justify-end mb-4 relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center justify-center h-10 w-10 bg-white rounded-full shadow hover:bg-gray-100 border overflow-hidden"
          >
            {/* Conditional Rendering for Profile Photo */}
            {user?.photoUrl ? (
              <img 
                src={user.photoUrl} 
                alt="Profile" 
                className="h-full w-full object-cover"
              />
            ) : (
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
            )}
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-12 w-56 bg-white border rounded-lg shadow-xl z-50">
              <div className="px-4 py-3 border-b bg-gray-50 rounded-t-lg">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.fullName || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                >
                  Profile Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Nested Route Outlet */}
        <div className="bg-white rounded-lg shadow p-6 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;