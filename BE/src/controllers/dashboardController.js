import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import Room from '../models/Room.js';

export const getDashboardStats = async (req, res) => {
  try {
    // Get start of today in UTC (00:00:00)
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    
    // Get start of tomorrow in UTC (00:00:00)
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);

    console.log('Querying appointments between:', todayStart, 'and', tomorrowStart);

    const [doctorsCount, patientsCount, availableRoomsCount, todaysAppointments] = await Promise.all([
      Doctor.countDocuments(),
      Patient.countDocuments(),
      Room.countDocuments({ status: 'available' }),
      Appointment.countDocuments({ 
        appointmentDate: { 
          $gte: todayStart,
          $lt: tomorrowStart
        }
      })
    ]);

    // Get weekly appointments data
    const oneWeekAgo = new Date(todayStart);
    oneWeekAgo.setUTCDate(oneWeekAgo.getUTCDate() - 7);
    
    const weeklyAppointments = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: oneWeekAgo }
        }
      },
      {
        $group: {
          _id: { 
            $dateToString: { 
              format: "%Y-%m-%d", 
              date: "$appointmentDate",
              timezone: "UTC"
            } 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.status(200).json({
      doctorsCount,
      patientsCount,
      availableRoomsCount,
      todaysAppointments,
      weeklyAppointments
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};