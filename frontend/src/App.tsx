import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Landing from "./Pages/Landing";
import Availability from "./Pages/Availability";
import MeetingTypes from "./Pages/MeetingTypes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/availability" element={<Availability />} />
        <Route path="/meeting-types" element={<MeetingTypes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;