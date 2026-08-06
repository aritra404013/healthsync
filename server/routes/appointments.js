import express from 'express';
import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';
import { localDb } from '../config/localDb.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Helper to format Mongoose appointment to match frontend doctorId structure
const formatAppointment = (appt) => {
  if (!appt) return null;
  const doc = appt.toObject ? appt.toObject() : appt;
  
  // Map doctorInfo data back to doctorId key for frontend compatibility
  doc.doctorId = {
    _id: doc.doctorId,
    name: doc.doctorInfo?.name || 'Doctor Consultation',
    specialty: doc.doctorInfo?.specialty || 'General Practice',
    imageUrl: doc.doctorInfo?.imageUrl || '',
    location: { address: doc.doctorInfo?.address || '' },
    phone: doc.doctorInfo?.phone || ''
  };
  return doc;
};

// POST /api/appointments — Create appointment
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { doctorId, doctorInfo, date, time, type = 'in-person', reason, notes } = req.body;
    if (!date || !time) {
      return res.status(400).json({ message: 'date and time are required' });
    }

    if (mongoose.connection.readyState === 1) {
      const appointment = await Appointment.create({
        userId: req.user?._id || null,
        doctorId: String(doctorId),
        doctorInfo: {
          name: doctorInfo?.name || 'Doctor Consultation',
          specialty: doctorInfo?.specialty || 'General Practice',
          imageUrl: doctorInfo?.imageUrl || '',
          address: doctorInfo?.address || '',
          phone: doctorInfo?.phone || ''
        },
        date: new Date(date),
        time,
        type,
        reason,
        notes,
        status: 'confirmed'
      });
      return res.status(201).json(formatAppointment(appointment));
    }

    const docInfo = localDb.findById('doctors', doctorId) || localDb.find('doctors')[0];
    const newAppt = localDb.insert('appointments', {
      doctorId: {
        _id: docInfo._id,
        name: docInfo.name,
        specialty: docInfo.specialty,
        imageUrl: docInfo.imageUrl,
        location: { address: docInfo.address }
      },
      date: new Date(date).toISOString(),
      time,
      type,
      reason,
      notes: notes || '',
      status: 'confirmed'
    });

    res.status(201).json(newAppt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/appointments — Get user's appointments
router.get('/', optionalAuth, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const query = req.user ? { userId: req.user._id } : {};
      const appointments = await Appointment.find(query).sort({ date: -1 });
      const transformed = appointments.map(formatAppointment);
      return res.json(transformed);
    }
    const appointments = localDb.find('appointments');
    res.json(appointments);
  } catch (error) {
    res.json(localDb.find('appointments'));
  }
});

// GET /api/appointments/:id
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const appointment = await Appointment.findById(req.params.id);
      if (appointment) return res.json(formatAppointment(appointment));
    }
    const found = localDb.findById('appointments', req.params.id) || localDb.find('appointments')[0];
    res.json(found);
  } catch (error) {
    res.json(localDb.find('appointments')[0]);
  }
});

// PATCH /api/appointments/:id — Update status
router.patch('/:id', optionalAuth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    if (mongoose.connection.readyState === 1) {
      const appointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        { ...(status && { status }), ...(notes && { notes }) },
        { new: true }
      );
      if (appointment) return res.json(formatAppointment(appointment));
    }
    const updated = localDb.update('appointments', req.params.id, { ...(status && { status }), ...(notes && { notes }) });
    res.json(updated || localDb.find('appointments')[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
