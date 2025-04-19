import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: { 
    type: String, 
    required: true,
    trim: true,
    uppercase: true
  },
  doctorName: { 
    type: String, 
    required: true,
    trim: true
  },
  appointmentDate: { 
    type: Date, 
    required: true,
    index: true // For faster date queries
  },
  timeSlot: { 
    type: String, 
    required: true,
    enum: [
      '09:00 AM', '10:00 AM', '11:00 AM',
      '12:00 PM', '01:00 PM', '02:00 PM',
      '03:00 PM', '04:00 PM', '05:00 PM'
    ]
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  }
}, {
  timestamps: true
});

// Index for faster queries on common fields
appointmentSchema.index({ patientId: 1, doctorName: 1, appointmentDate: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;