import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Timetable } from "./components/Timetable";
import { AddEntry } from "./components/AddTimetableEntry";
import { Couriers } from "./components/Couriers";
import { EditTimetableEntry } from "./components/EditTimetableEntry";

export default function App() {
  return (
    <Router>
      <div className="p-4">
        <h1>Couriers Timetable</h1>
        <Routes>
          <Route path="/" element={<Timetable />} />
          <Route path="/add-entry" element={<AddEntry />} />
          <Route path="/couriers" element={<Couriers />} />
          <Route path="/edit-timetable/:id" element={<EditTimetableEntry />} />
        </Routes>
        <footer>&copy; 2025 Daniil Tkachenko. All rights reserved.</footer>
      </div>
    </Router>
  );
}
