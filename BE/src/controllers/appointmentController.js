import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';

export const bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorName, appointmentDate, timeSlot } = req.body;

    // Validate required fields
    if (!patientId || !doctorName || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: patientId, doctorName, appointmentDate, timeSlot'
      });
    }

    // Validate patient exists
    // const patient = await Patient.findOne({ patientId: patientId.toUpperCase() });
    const patient = await Patient.findOne({ patientID:patientId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${patientId} not found. Please register the patient first.`
      });
    }

    // Validate doctor exists
    const doctor = await Doctor.findOne({ name: doctorName });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: `Doctor ${doctorName} not found. Please check the name.`
      });
    }

    // Check for existing appointment
    const existingAppointment = await Appointment.findOne({
      doctorName,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked with the selected doctor'
      });
    }

    // Create new appointment
    const newAppointment = new Appointment({
      patientId: patientId.toUpperCase(),
      doctorName,
      appointmentDate: new Date(appointmentDate),
      timeSlot
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment: newAppointment
    });

  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ appointmentDate: 1 });
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching appointments',
      error: error.message 
    });
  }
};

export const getAppointmentsByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const appointments = await Appointment.find({
      appointmentDate: { $gte: startOfDay, $lt: endOfDay }
    }).sort({ timeSlot: 1 });

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching appointments by date',
      error: error.message 
    });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling appointment',
      error: error.message
    });
  }
};

export const countAppointments = async (req, res) => {
  try {
    const count = await Appointment.countDocuments();
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error counting appointments',
      error: error.message
    });
  }
};