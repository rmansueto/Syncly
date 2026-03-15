import React, { JSX } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
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

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path: string) => {
    const p = location.pathname.replace(/\/+$/,""); // trim trailing slash
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
          {navBtn("Contacts", <ArrowsRightLeftIcon className="h-5 w-5" /> , undefined, () => {/* keep as placeholder */})}
          {navBtn("Workflows", <Squares2X2Icon className="h-5 w-5" /> , undefined, () => {/* placeholder */})}
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

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Main Content (nested route outlet) */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <button
            onClick={() => navigate("meeting-types")}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            + New Event Type
          </button>
        </div>

        {/* Render nested pages: MeetingTypes, Availability, etc. */}
        <div className="bg-white rounded-lg shadow p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;