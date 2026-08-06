import express from 'express';
import mongoose from 'mongoose';
import Prescription from '../models/Prescription.js';
import { localDb } from '../config/localDb.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/prescriptions
router.get('/', optionalAuth, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const query = req.user ? { userId: req.user._id } : {};
      const prescriptions = await Prescription.find(query)
        .populate('doctorId', 'name specialty')
        .sort({ createdAt: -1 });
      return res.json(prescriptions);
    }
    const rxs = localDb.find('prescriptions');
    res.json(rxs);
  } catch (error) {
    res.json(localDb.find('prescriptions'));
  }
});

// POST /api/prescriptions — Create from AI recommendation
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { medications, chatSessionId } = req.body;
    const created = [];

    if (mongoose.connection.readyState === 1) {
      for (const med of (medications || [])) {
        const prescription = await Prescription.create({
          userId: req.user?._id || null,
          chatSessionId,
          medication: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          instructions: med.notes || '',
          duration: med.duration || '7 days',
          status: 'active'
        });
        created.push(prescription);
      }
      return res.status(201).json(created);
    }

    for (const med of (medications || [])) {
      const rx = localDb.insert('prescriptions', {
        chatSessionId,
        medication: med.name,
        dosage: med.dosage || '500mg',
        frequency: med.frequency || 'Daily',
        instructions: med.notes || '',
        duration: med.duration || '7 days',
        status: 'active',
        refillsRemaining: 1,
        doctorId: { name: 'Dr. HealthSync Practitioner' }
      });
      created.push(rx);
    }
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
