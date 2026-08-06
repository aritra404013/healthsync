import express from 'express';
import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import { localDb } from '../config/localDb.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// POST /api/appointments — Create appointment
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { doctorId, date, time, type = 'in-person', reason, notes } = req.body;
    if (!date || !time) {
      return res.status(400).json({ message: 'date and time are required' });
    }

    if (mongoose.connection.readyState === 1) {
      const appointment = await Appointment.create({
        userId: req.user?._id || null,
        doctorId, date: new Date(date), time, type, reason, notes,
        status: 'confirmed'
      });
      const populated = await appointment.populate('doctorId', 'name specialty imageUrl location');
      return res.status(201).json(populated);
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
      const appointments = await Appointment.find(query)
        .populate('doctorId', 'name specialty imageUrl location phone')
        .sort({ date: -1 });
      return res.json(appointments);
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
      const appointment = await Appointment.findById(req.params.id)
        .populate('doctorId', 'name specialty imageUrl location phone credentials');
      if (appointment) return res.json(appointment);
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
      ).populate('doctorId', 'name specialty imageUrl');
      if (appointment) return res.json(appointment);
    }
    const updated = localDb.update('appointments', req.params.id, { ...(status && { status }), ...(notes && { notes }) });
    res.json(updated || localDb.find('appointments')[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
