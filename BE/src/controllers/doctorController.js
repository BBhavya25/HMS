import Doctor from '../models/Doctor.js';

// Add a new doctor (now includes imageUrl)
export const addDoctor = async (req, res) => {
  try {
    const { name, specialization, contact, email, imageUrl } = req.body;
    const newDoctor = new Doctor({ 
      name, 
      specialization, 
      contact, 
      email, 
      imageUrl 
    });
    await newDoctor.save();
    res.status(201).json({ message: 'Doctor added successfully', doctor: newDoctor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get doctors by specialization
export const getDoctorsBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;
    const doctors = await Doctor.find({ specialization });
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a doctor (now can update imageUrl)
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true }
    );
    res.status(200).json({ 
      message: 'Doctor updated successfully', 
      doctor: updatedDoctor 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a doctor
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    await Doctor.findByIdAndDelete(id);
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};