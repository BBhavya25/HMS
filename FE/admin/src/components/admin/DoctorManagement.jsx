import React, { useState, useEffect } from 'react';
import '../styles/DoctorManagement.css';

const APIURL = 'http://localhost:5000/api/doctors';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    contact: '',
    email: '',
    imageUrl: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [currentDoctorId, setCurrentDoctorId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    const response = await fetch(APIURL);
    const data = await response.json();
    setDoctors(data);
    const specs = [...new Set(data.map(doctor => doctor.specialization))];
    setSpecializations(specs);
  };

  const fetchDoctorsBySpecialization = async (specialization) => {
    if (!specialization) {
      fetchDoctors();
      return;
    }
    const response = await fetch(`${APIURL}/specialization/${specialization}`);
    const data = await response.json();
    setDoctors(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editMode 
      ? `${APIURL}/${currentDoctorId}`
      : APIURL;
    const method = editMode ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    fetchDoctors();
    resetForm();
    setShowModal(false);
  };

  const handleEdit = (doctor) => {
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      contact: doctor.contact,
      email: doctor.email,
      imageUrl: doctor.imageUrl || '',
    });
    setEditMode(true);
    setCurrentDoctorId(doctor._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await fetch(`${APIURL}/${id}`, { method: 'DELETE' });
    fetchDoctors();
  };

  const resetForm = () => {
    setFormData({ name: '', specialization: '', contact: '', email: '', imageUrl: '' });
    setEditMode(false);
    setCurrentDoctorId(null);
    setShowModal(false);
  };

  const openAddDoctorModal = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="doctor-management">
      <div className="header-section">
        <h2>Doctors</h2>
        <div className="actions">
          <button className="add-doctor-btn" onClick={openAddDoctorModal}>
            Add Doctor
          </button>
          <div className="filter-section">
            <select onChange={(e) => fetchDoctorsBySpecialization(e.target.value)}>
              <option value="">All Specializations</option>
              {specializations.map((spec, index) => (
                <option key={index} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit Doctor */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal">
              <div className="modal-header">
                <h3>{editMode ? 'Edit Doctor' : 'Add Doctor'}</h3>
                <button className="close-btn" onClick={resetForm}>×</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="specialization"
                    placeholder="Specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="contact"
                    placeholder="Contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="imageUrl"
                    placeholder="Image URL"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    {editMode ? 'Update' : 'Add'}
                  </button>
                  <button type="button" className="cancel-btn" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Doctors Cards */}
      <div className="doctors-grid">
        {doctors.map((doctor) => (
          <div key={doctor._id} className="doctor-card">
            <div className="card-image-container">
              {doctor.imageUrl ? (
                <img 
                  src={doctor.imageUrl} 
                  alt={doctor.name} 
                  className="doctor-image"
                />
              ) : (
                <div className="no-image">No Image</div>
              )}
            </div>
            <div className="card-content">
              <h3>{doctor.name}</h3>
              <p><strong>Specialization:</strong> {doctor.specialization}</p>
              <p><strong>Contact:</strong> {doctor.contact}</p>
              <p><strong>Email:</strong> {doctor.email}</p>
            </div>
            <div className="card-actions">
              <button className="edit-btn" onClick={() => handleEdit(doctor)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => handleDelete(doctor._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorManagement;