import { useState, useEffect } from "react";
import { format } from "date-fns"; 
import { useNavigate, Link } from "react-router-dom";

import '../../style/global.css'; 
import '../../style/Timetable.css'; 

interface TimetableEntry {
  id: number;
  courier_name: string;
  destination_name: string;
  start_time: string;
  end_time: string;
}

export function Timetable() {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://couriers-timetable-server.onrender.com/timetable")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTimetable(data);
      })
      .catch((error) => console.error("Error fetching timetable:", error));
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure that you want to delete this entry?")) return;
  
    try {
      await fetch(`https://couriers-timetable-server.onrender.com/timetable/${id}`, {
        method: "DELETE",
      });
      setTimetable((prev) => prev.filter((entry) => entry.id !== id));
      alert("Entry deleted successfully!");
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete entry. Please try again.");
    }
  };
  
  const sortData = (field: keyof TimetableEntry) => {
    const sortedData = [...timetable].sort((a, b) => {
      if (field === "start_time" || field === "end_time") {
        return sortOrder === "asc"
          ? new Date(a[field]).getTime() - new Date(b[field]).getTime()
          : new Date(b[field]).getTime() - new Date(a[field]).getTime();
      } else if (typeof a[field] === "number" && typeof b[field] === "number") {
        return sortOrder === "asc" ? a[field] - b[field] : b[field] - a[field];
      } else {
        return sortOrder === "asc"
          ? String(a[field]).localeCompare(String(b[field]))
          : String(b[field]).localeCompare(String(a[field]));
      }
    });
  
    setTimetable(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  
  const formatTime = (time: string) => format(new Date(time), "dd-MM-yyyy HH:mm");

  return (
    <div className="container">
      <h2 className="text-xl font-semibold">Timetable</h2>
      <div className="top-buttons">
        <div>
          <Link to="/add-entry">
            <button className="big-button">
              Add New Entry
            </button>
          </Link>
        </div>

        <div>
          <Link to="/couriers">
            <button className="big-button">
              Couriers
            </button>
          </Link>
        </div>
      </div>

      <table className="table">
        <thead >
          <tr>
            <th onClick={() => sortData("id")}>Id</th>
            <th onClick={() => sortData("courier_name")}>Courier</th>
            <th onClick={() => sortData("destination_name")}>Destination</th>
            <th onClick={() => sortData("start_time")}>Start Time</th>
            <th onClick={() => sortData("end_time")}>End Time</th>
            <th className="actions-th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {timetable.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.id}</td>
              <td>{entry.courier_name}</td>
              <td>{entry.destination_name}</td>
              <td>{formatTime(entry.start_time)}</td>
              <td>{formatTime(entry.end_time)}</td>
              <td>
                <div className="actions">
                  <button
                    onClick={() => navigate(`/edit-timetable/${entry.id}`)}
                    className="edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="delete"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
