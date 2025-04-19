import express from 'express';
import {
  addDoctor,
  getAllDoctors,
  getDoctorsBySpecialization,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from '../controllers/doctorController.js';

const router = express.Router();

// Add a new doctor
router.post('/doctors', addDoctor);

// Get all doctors
router.get('/doctors', getAllDoctors);

// Get a single doctor by ID
router.get('/doctors/:id', getDoctorById);

// Get doctors by specialization
router.get('/doctors/specialization/:specialization', getDoctorsBySpecialization);

// Update a doctor
router.put('/doctors/:id', updateDoctor);

// Delete a doctor
router.delete('/doctors/:id', deleteDoctor);

export default router;