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
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";

interface User {
  id: number;
  fullName: string;
  email: string;
  photoUrl?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

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
    
    return (
      <button
        onClick={onClick ?? (() => navigate(path ?? ""))}
        className={`group flex items-center justify-between w-full p-3 rounded-xl transition-all duration-200 ${
          active 
            ? "bg-indigo-50 text-indigo-700 shadow-sm" 
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`${active ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}`}>
            {React.cloneElement(icon as React.ReactElement<any>, { className: "h-5 w-5" })}
          </div>
          <span className="font-medium text-sm">{label}</span>
        </div>
        {active && <ChevronRightIcon className="h-4 w-4 text-indigo-400" />}
      </button>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 p-6 flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Squares2X2Icon className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Syncly</h1>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1">
          <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Main Menu</p>
          {navBtn("Meeting Types", <CalendarIcon />, "meeting-types")}
          {navBtn("Meetings", <ClockIcon />, "meetings")}
          {navBtn("Availability", <UserIcon />, "availability")}
          
          <div className="my-4 border-t border-gray-50"></div>
          
          <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Tools</p>
          {navBtn("Contacts", <ArrowsRightLeftIcon />)}
          {navBtn("Workflows", <Squares2X2Icon />)}
          {navBtn("Integrations", <Cog6ToothIcon />)}
          {navBtn("Analytics", <ChartBarIcon />)}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-50">
          {navBtn("Help Center", <QuestionMarkCircleIcon />)}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header / Top Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-end px-8 sticky top-0 z-30">
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
            >
              <div className="h-9 w-9 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-100 flex items-center justify-center">
                {user?.photoUrl ? (
                  <img src={user.photoUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <UserCircleIcon className="h-7 w-7 text-gray-300" />
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-gray-900 leading-none">{user?.fullName || "User"}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Free Plan</p>
              </div>
            </button>

            {profileOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setProfileOpen(false)}
                ></div>
                <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-5 py-4 bg-gray-50/50 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.fullName}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => { navigate("/profile"); setProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors"
                    >
                      <UserIcon className="h-4 w-4 text-gray-400" />
                      Profile Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-lg text-sm text-red-600 transition-colors"
                    >
                      <ArrowsRightLeftIcon className="h-4 w-4 rotate-90" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;