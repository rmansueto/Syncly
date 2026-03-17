import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Landing from "./Pages/Landing";
import Availability from "./Pages/Availability";
import MeetingTypes from "./Pages/MeetingTypes";
import Booking from "./Pages/Booking";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard layout with nested routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<MeetingTypes />} />
          <Route path="meeting-types" element={<MeetingTypes />} />
          <Route path="availability" element={<Availability />} />
        </Route>
        <Route path="/booking/:id" element={<Booking />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;