import express from 'express';
import mongoose from 'mongoose';
import TreatmentPlan from '../models/TreatmentPlan.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// POST /api/treatment-plans — Save a new treatment plan (auth required)
router.post('/', protect, async (req, res) => {
  try {
    const { sessionId, diagnosis, nearbyDoctors, notes, title } = req.body;

    if (!diagnosis) {
      return res.status(400).json({ message: 'Diagnosis data is required to save a treatment plan' });
    }

    // Auto-generate a title from the top condition
    const autoTitle = title || 
      (diagnosis.conditions?.[0]?.name ? `${diagnosis.conditions[0].name} — Care Plan` : 'AI Treatment Plan');

    const plan = await TreatmentPlan.create({
      userId: req.user._id,
      sessionId: sessionId || null,
      title: autoTitle,
      diagnosis,
      nearbyDoctors: nearbyDoctors || [],
      notes: notes || '',
      status: 'active'
    });

    res.status(201).json(plan);
  } catch (error) {
    console.error('Save treatment plan error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/treatment-plans — List all plans for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const plans = await TreatmentPlan.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('title diagnosis.severity diagnosis.conditions status createdAt updatedAt');
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/treatment-plans/:id — Get specific plan
router.get('/:id', protect, async (req, res) => {
  try {
    const plan = await TreatmentPlan.findOne({ _id: req.params.id, userId: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Treatment plan not found' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/treatment-plans/:id — Update plan status or notes
router.patch('/:id', protect, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const plan = await TreatmentPlan.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...(status && { status }), ...(notes !== undefined && { notes }) },
      { new: true }
    );
    if (!plan) return res.status(404).json({ message: 'Treatment plan not found' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/treatment-plans/:id — Delete a plan
router.delete('/:id', protect, async (req, res) => {
  try {
    const plan = await TreatmentPlan.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Treatment plan not found' });
    res.json({ message: 'Treatment plan deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
