import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import doctorRoutes from './routes/doctors.js';
import appointmentRoutes from './routes/appointments.js';
import pharmacyRoutes from './routes/pharmacies.js';
import prescriptionRoutes from './routes/prescriptions.js';
import treatmentPlanRoutes from './routes/treatmentPlans.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman) or matching any domain in production/dev
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/pharmacies', pharmacyRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/treatment-plans', treatmentPlanRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

// Start server
connectDB().then((conn) => {
  const modeStr = conn ? 'with MongoDB' : 'with in-memory mode';
  app.listen(PORT, () => {
    console.log(`HealthSync API server running on http://localhost:${PORT} (${modeStr})`);
  });
}).catch(err => {
  app.listen(PORT, () => {
    console.log(`HealthSync API server running on http://localhost:${PORT} (standalone mode)`);
  });
});
