import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../../style/global.css'; 
import '../../style/AddEntry.css'; 

interface TimetableEntry {
  courier_id: number;
  destination_name: string;
  start_time: string;
  end_time: string;
}

export function AddEntry() {
  const [couriers, setCouriers] = useState<{ id: number; name: string }[]>([]);
  const [newEntry, setNewEntry] = useState<TimetableEntry>({
    courier_id: 0,
    destination_name: "",
    start_time: "",
    end_time: "",
  });
  const [errors, setErrors] = useState<string[]>([]); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://couriers-timetable-server.onrender.com/couriers")
      .then((res) => res.json())
      .then((data) => setCouriers(data))
      .catch((error) => console.error("Error fetching couriers:", error));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    if (newEntry.courier_id === 0) newErrors.push("Please select a courier.");
    if (!newEntry.destination_name) newErrors.push("Destination name is required.");
    if (!newEntry.start_time) newErrors.push("Start time is required.");
    if (!newEntry.end_time) newErrors.push("End time is required.");
    if (new Date(newEntry.start_time) >= new Date(newEntry.end_time)) {
      newErrors.push("End time must be later than start time.");
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      fetch("https://couriers-timetable-server.onrender.com/timetable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEntry),
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((data) => {
              throw new Error(data.error || "An error occurred");
            });
          }
          return res.json();
        })
        .then(() => {
          navigate("/"); 
        })
        .catch((error) => {
          console.error("Error adding timetable entry:", error);
          setErrors([error.message]); 
          setIsSubmitting(false);
        });
    }
  };

  return (
    <div className="container">
      <h2 className="text-xl font-semibold">Add New Timetable Entry</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div>
          <label className="block">Courier</label>
          <select
            name="courier_id"
            value={newEntry.courier_id}
            onChange={handleChange}
            className="border p-2 mb-2 w-full"
            aria-placeholder="Select a courier"
          >
            <option value={0}>Select a courier</option>
            {couriers.map((courier) => (
              <option key={courier.id} value={courier.id}>
                {courier.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block">Destination</label>
          <input
            type="text"
            name="destination_name"
            value={newEntry.destination_name}
            onChange={handleChange}
            className="border p-2 mb-2 w-full"
            placeholder="Enter destination"
          />
        </div>
        <div>
          <label className="block">Start Time</label>
          <input
            type="datetime-local"
            name="start_time"
            value={newEntry.start_time}
            onChange={handleChange}
            className="border p-2 mb-2 w-full"
          />
        </div>
        <div>
          <label className="block">End Time</label>
          <input
            type="datetime-local"
            name="end_time"
            value={newEntry.end_time}
            onChange={handleChange}
            className="border p-2 mb-2 w-full"
          />
        </div>

        {errors.length > 0 && (
          <div className="text-red-500">
            <ul>
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          className="mt-4 big-button add-button"
          disabled={isSubmitting} 
        >
          {isSubmitting ? "Adding..." : "Add Entry"}
        </button>
      </form>
      <div className="mt-4">
        <Link to="/">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Back to Timetable
          </button>
        </Link>
      </div>
    </div>
  );
}
