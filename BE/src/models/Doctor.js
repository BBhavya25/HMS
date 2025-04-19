import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  imageUrl: { type: String } // Added image URL field (not required by default)
});

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;