import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DoctorManagement from "./DoctorManagement";
import RoomManagement from "./RoomManagement";
import PatientManagement from "./SearchPatient";
import AppointmentManagement from "./ViewAppointments";
import Dashboard from "./AdminDashboard"; // Typo! Should be Dashboard.js
import "../styles/Home.css";

const Home = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'doctors':
        return <DoctorManagement />;
      case 'patients':
        return <PatientManagement />;
      case 'rooms':
        return <RoomManagement />;
      case 'appointments':
        return <AppointmentManagement />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarActive(!isSidebarActive);
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarActive ? 'active' : ''}`}>
        <div className="sidebar-header">
          <h2>🏥 Admin Panel</h2>
          <p>{user?.name || "Admin"}</p>
        </div>

        <div className="sidebar-buttons">
          <button 
            onClick={() => { setActiveTab('dashboard'); setIsSidebarActive(false); }}
            className={activeTab === 'dashboard' ? 'active' : ''}
          >
            Dashboard
          </button>
          <button 
            onClick={() => { setActiveTab('doctors'); setIsSidebarActive(false); }}
            className={activeTab === 'doctors' ? 'active' : ''}
          >
            Doctors
          </button>
          <button 
            onClick={() => { setActiveTab('patients'); setIsSidebarActive(false); }}
            className={activeTab === 'patients' ? 'active' : ''}
          >
            Patients
          </button>
          <button 
            onClick={() => { setActiveTab('rooms'); setIsSidebarActive(false); }}
            className={activeTab === 'rooms' ? 'active' : ''}
          >
            Rooms
          </button>
          <button 
            onClick={() => { setActiveTab('appointments'); setIsSidebarActive(false); }}
            className={activeTab === 'appointments' ? 'active' : ''}
          >
            Appointments
          </button>
        </div>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-area">
        {/* Mobile toggle button */}
        {isMobile && (
          <button 
            className="sidebar-toggle-btn" 
            onClick={toggleSidebar}
          >
            ☰
          </button>
        )}

        {/* Fixed Navbar */}
        <header className="main-navbar">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <p>Welcome, {user?.name || "Admin"}</p>
        </header>

        {/* Content */}
        <div className="content-section">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Home;
