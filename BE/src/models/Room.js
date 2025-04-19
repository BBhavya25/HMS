import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  roomType: { type: String, required: true },
  capacity: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['available', 'occupied', 'maintenance'], 
    default: 'available' 
  },
  patientName: { type: String } // Store patient name instead of doctor reference
});

const Room = mongoose.model('Room', roomSchema);
export default Room;
