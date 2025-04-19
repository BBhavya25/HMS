import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import doctorRoutes from './src/routes/doctorRoutes.js';
import roomRoutes from './src/routes/roomRoutes.js';
import patientRoutes from './src/routes/patientRoutes.js';
import appointmentRoutes from './src/routes/appointmentRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;


const corsOptions = {
    origin: 'http://localhost:5173',  // Only allow requests from this origin
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allow specific headers
    credentials: true,  // Allow cookies to be sent with the request
 };

app.use(cors(corsOptions));
app.use(express.json());

connectDB();

// Routes
app.use('/api', authRoutes);
app.use('/api', doctorRoutes);
app.use('/api', roomRoutes);
app.use('/api', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api', dashboardRoutes);


app.get('/', (req, res) => {
    res.send('Hospital Management System API');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
