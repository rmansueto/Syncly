import { useNavigate } from "react-router-dom";
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

const eventTypes = [
  { title: "Follow-Up", duration: "30 min", type: "Group" },
  { title: "Daily Workflow Review", duration: "15 min", type: "One-on-One" },
  { title: "Quick Check-in", duration: "30 min", type: "Group" },
  { title: "30 Minute Meeting", duration: "30 min", type: "One-on-One" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8 text-indigo-600">Syncly</h1>

        <nav className="flex flex-col gap-4 flex-1">
          <button onClick={() => navigate("/meeting-types")} className="flex items-center gap-3 p-2 hover:bg-indigo-100 rounded">
            <CalendarIcon className="h-5 w-5" />
            Event Types
          </button>
          <button onClick={() => navigate("/meeting-types")} className="flex items-center gap-3 p-2 hover:bg-indigo-100 rounded">
            <ClockIcon className="h-5 w-5" />
            Meetings
          </button>
          <button onClick={() => navigate("/availability")} className="flex items-center gap-3 p-2 hover:bg-indigo-100 rounded">
            <UserIcon className="h-5 w-5" />
            Availability
          </button>
          <button className="flex items-center gap-3 p-2 hover:bg-indigo-100 rounded">
            <ArrowsRightLeftIcon className="h-5 w-5" />
            Contacts
          </button>
          <button className="flex items-center gap-3 p-2 hover:bg-indigo-100 rounded">
            <Squares2X2Icon className="h-5 w-5" />
            Workflows
          </button>
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

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Event Types</h2>
          <button
            onClick={() => navigate("/meeting-types")}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            + New Event Type
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventTypes.map((event, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <p className="text-gray-500 text-sm mb-4">
                {event.duration}, {event.type}
              </p>
              <div className="flex gap-2">
                <button className="flex-1 border border-gray-300 rounded px-3 py-1 hover:bg-gray-100" onClick={() => navigate("/meeting-types")}>
                  Open
                </button>
                <button className="flex-1 bg-indigo-600 text-white rounded px-3 py-1 hover:bg-indigo-700">
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;