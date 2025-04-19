import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import '../styles/app.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    doctorsCount: 0,
    patientsCount: 0,
    availableRoomsCount: 0,
    todaysAppointments: 0,
    weeklyAppointments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/dashboard/stats');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch dashboard stats');
      }

      const data = await response.json();
      console.log('Dashboard data:', data);
      setStats(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Prepare chart data
  const weeklyChartData = {
    labels: stats.weeklyAppointments.map(item => item._id),
    datasets: [{
      label: 'Appointments',
      data: stats.weeklyAppointments.map(item => item.count),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
      tension: 0.1
    }]
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="dashboard-error">Error: {error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Doctors</h3>
          <p className="stat-value">{stats.doctorsCount}</p>
          <p className="stat-label">Total Registered</p>
        </div>
        
        <div className="stat-card">
          <h3>Patients</h3>
          <p className="stat-value">{stats.patientsCount}</p>
          <p className="stat-label">Total Registered</p>
        </div>
        
        <div className="stat-card">
          <h3>Today's Appointments</h3>
          <p className="stat-value">{stats.todaysAppointments}</p>
          <p className="stat-label">Scheduled Today</p>
        </div>
        
        <div className="stat-card">
          <h3>Available Rooms</h3>
          <p className="stat-value">{stats.availableRoomsCount}</p>
          <p className="stat-label">Ready for Use</p>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart-card">
          <h3>Weekly Appointments</h3>
          <div className="chart-wrapper">
            <Line 
              data={weeklyChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Appointments by Day' }
                }
              }}
            />
          </div>
        </div>
        
        <div className="chart-card">
          <h3>Appointment Distribution</h3>
          <div className="chart-wrapper">
            <Bar 
              data={weeklyChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Daily Appointment Count' }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;