import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import '../../style/global.css'; 

interface Courier {
  id: number;
  name: string;
}

export function Couriers() {
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [newCourier, setNewCourier] = useState<string>("");

  useEffect(() => {
    fetch("https://couriers-timetable-server.onrender.com/couriers")
      .then((res) => res.json())
      .then((data) => {
        setCouriers(data);

      })
      .catch((error) => console.error("Error fetching couriers:", error));
  }, []);

  const handleAddCourier = () => {
    if (newCourier.trim()) {
      fetch("https://couriers-timetable-server.onrender.com/couriers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCourier }),
      })
        .then((res) => res.json())
        .then((data) => {
          setCouriers([...couriers, data]);
          setNewCourier("");
        })
        .catch((error) => console.error("Error adding courier:", error));
    }
  };

  const handleDeleteCourier = (id: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить этого курьера?")) return;
    fetch(`https://couriers-timetable-server.onrender.com/couriers/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setCouriers(couriers.filter((courier) => courier.id !== id));
      })
      .catch((error) => console.error("Error deleting courier:", error));
  };

  return (
    <div className="container">
      <h2 className="text-xl font-semibold">Couriers</h2>

      <div className="top-buttons">
        <input
          type="text"
          value={newCourier}
          onChange={(e) => setNewCourier(e.target.value)}
          className="top-input"
          placeholder="Enter new courier name"
        />
        <button
          onClick={handleAddCourier}
          className="px-4 "
        >
          Add Courier
        </button>
      </div>

      <table className="mt-4">
        <thead>
          <tr>
            <th className="actions-th">Id</th>
            <th className="actions-th">Courier Name</th>
            <th className="actions-th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {couriers.map((courier) => (
            <tr key={courier.id}>
              <td className="border p-2">{courier.id}</td>
              <td className="border p-2">{courier.name}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDeleteCourier(courier.id)}
                  className="delete"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
