import express from 'express';
import {
  bookAppointment,
  getAllAppointments,
  getAppointmentsByDate,
  cancelAppointment,
  countAppointments
} from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/', bookAppointment);
router.get('/', getAllAppointments);
router.get('/date/:date', getAppointmentsByDate);
router.delete('/:id', cancelAppointment);
router.get('/count', countAppointments);

export default router;