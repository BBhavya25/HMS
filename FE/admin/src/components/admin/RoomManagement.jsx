import React, { useState, useEffect } from 'react';
import '../styles/Room.css';

const APIURL = 'http://localhost:5000/api/rooms';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: '',
    capacity: '',
  });
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const response = await fetch(APIURL);
    const data = await response.json();
    setRooms(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(APIURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    fetchRooms();
    setFormData({ roomNumber: '', roomType: '', capacity: '' });
  };

  const handleAssign = async (roomId) => {
    const patientName = prompt('Enter Patient Name:');
    if (patientName) {
      await fetch(`${APIURL}/${roomId}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientName }),
      });
      fetchRooms();
    }
  };

  const handleFree = async (roomId) => {
    await fetch(`${APIURL}/${roomId}/free`, {
      method: 'PUT',
    });
    fetchRooms();
  };

  const handleDelete = async (roomId) => {
    await fetch(`${APIURL}/${roomId}`, {
      method: 'DELETE',
    });
    fetchRooms();
  };

  const filteredRooms = filterStatus === 'all' 
    ? rooms 
    : rooms.filter(room => room.status === filterStatus);

  return (
    <div className="room-management">
      <h2>Add New Room</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="roomNumber"
          placeholder="Room Number"
          value={formData.roomNumber}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="roomType"
          placeholder="Room Type"
          value={formData.roomType}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={formData.capacity}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Room</button>
      </form>

      <h2>Room List</h2>
      <div className="filter-section">
        <select onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Room Number</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Patient</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRooms.map((room) => (
            <tr key={room._id}>
              <td>{room.roomNumber}</td>
              <td>{room.roomType}</td>
              <td>{room.capacity}</td>
              <td className={`status-${room.status}`}>{room.status}</td>
              <td>{room.patientName || '-'}</td>
              <td>
                {room.status === 'available' && (
                  <button onClick={() => handleAssign(room._id)}>Assign</button>
                )}
                {room.status === 'occupied' && (
                  <button onClick={() => handleFree(room._id)}>Free</button>
                )}
                <button onClick={() => handleDelete(room._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomManagement;