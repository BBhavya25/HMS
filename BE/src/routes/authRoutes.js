import express from "express";
import { logInUser, signUpUser, logoutUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signUpUser);
router.post('/login', logInUser);
router.post('/logout', logoutUser);


export default router;


