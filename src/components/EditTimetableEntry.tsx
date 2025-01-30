import React, { useState, useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import '../../style/global.css'; 

export function EditTimetableEntry() {
  const { id } = useParams<{ id: string }>();
  
  const [formData, setFormData] = useState({
    courier_id: '',
    destination_name: '',
    start_time: '',
    end_time: ''
  });
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchTimetableData = async () => {
      try {
        const response = await fetch(`https://couriers-timetable-server.onrender.com/timetable/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
  
        if (data) {
          const start_time = data.start_time.replace('Z', '').slice(0, 16); // remove 'Z' and slice to match the format
          const end_time = data.end_time.replace('Z', '').slice(0, 16); // remove 'Z' and slice to match the format
  
          setFormData({
            courier_id: data.courier_id,
            destination_name: data.destination_name,
            start_time: start_time,
            end_time: end_time
          });
        }
      } catch (error) {
        console.error('Error fetching timetable data:', error);
      }
    };
  
    fetchTimetableData();
  }, [id]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://couriers-timetable-server.onrender.com/timetable/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Entry updated successfully!');
        navigate("/");
      } else {
        alert('Failed to update entry');
      }
    } catch (error) {
      console.error('Error updating timetable entry:', error);
      alert('Error updating timetable entry');
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <label className='edit-label'>
          Courier ID:
          <input
            type="text"
            name="courier_id"
            value={formData.courier_id}
            onChange={handleChange}
          />
        </label>
        <br />
        <label className='edit-label'>
          Destination Name:
          <input
            type="text"
            name="destination_name"
            value={formData.destination_name}
            onChange={handleChange}
          />
        </label>
        <br />
        <label className='edit-label'>
          Start Time:
          <input
            type="datetime-local"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
          />
        </label>
        <br />
        <label className='edit-label'>
          End Time:
          <input
            type="datetime-local"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Save Changes</button>
      </form>
    </div>
    
  );
};