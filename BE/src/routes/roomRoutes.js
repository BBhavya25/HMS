import express from 'express';
import {
  addRoom,
  getAllRooms,
  assignRoom,
  freeRoom,
  deleteRoom
} from '../controllers/roomController.js';

const router = express.Router();

router.post('/rooms', addRoom);
router.get('/rooms', getAllRooms);
router.put('/rooms/:roomId/assign', assignRoom);
router.put('/rooms/:roomId/free', freeRoom);
router.delete('/rooms/:id', deleteRoom);

export default router;