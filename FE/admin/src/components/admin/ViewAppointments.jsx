import React, { useState, useEffect } from 'react';
import '../styles/Form.css';

const APIURL = 'http://localhost:5000/api/appointments';

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const url = selectedDate 
        ? `${APIURL}/date/${selectedDate}`
        : APIURL;
      
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to fetch appointments');

      setAppointments(data.appointments || []);
    } catch (error) {
      setMessage({
        text: `❌ ${error.message}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      const response = await fetch(`${APIURL}/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to cancel appointment');

      setMessage({
        text: '✅ Appointment cancelled successfully',
        type: 'success'
      });
      fetchAppointments();
    } catch (error) {
      setMessage({
        text: `❌ ${error.message}`,
        type: 'error'
      });
    }
  };

  return (
    <div className="appointments-list-container">
      <h2>Appointments</h2>
      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <div className="filters">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          placeholder="Filter by date"
        />
        <button onClick={fetchAppointments}>Refresh</button>
      </div>

      {loading ? (
        <div className="loading">Loading appointments...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map(appt => (
                <tr key={appt._id}>
                  <td>{appt.patientId}</td>
                  <td>{appt.doctorName}</td>
                  <td>{new Date(appt.appointmentDate).toLocaleDateString()}</td>
                  <td>{appt.timeSlot}</td>
                  <td>{appt.status}</td>
                  <td>
                    {appt.status === 'scheduled' && (
                      <button 
                        className="cancel-btn"
                        onClick={() => handleCancel(appt._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
              
            ) : (
              <tr>
                <td colSpan="6">No appointments found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewAppointments;