import Room from '../models/Room.js';

// Add a new room
export const addRoom = async (req, res) => {
  try {
    const { roomNumber, roomType, capacity } = req.body;
    const newRoom = new Room({ roomNumber, roomType, capacity });
    await newRoom.save();
    res.status(201).json({ message: 'Room added successfully', room: newRoom });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all rooms
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Assign room to patient
export const assignRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { patientName } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.status = 'occupied';
    room.patientName = patientName;
    await room.save();

    res.status(200).json({ message: 'Room assigned successfully', room });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Free up a room
export const freeRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findByIdAndUpdate(
      roomId,
      { status: 'available', patientName: null },
      { new: true }
    );
    res.status(200).json({ message: 'Room freed successfully', room });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a room
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    await Room.findByIdAndDelete(id);
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};