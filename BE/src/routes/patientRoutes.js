import express from "express";
import {
    registerPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient
  } from '../controllers/patientController.js';

const router = express.Router();

router.post('/patients', registerPatient);
router.get('/patients', getAllPatients);
router.get('/patients/:id', getPatientById);
router.put('/patients/:id', updatePatient);
router.delete('/patients/:id', deletePatient);
export default router;



