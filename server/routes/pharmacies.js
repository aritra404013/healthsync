import express from 'express';
import mongoose from 'mongoose';
import Pharmacy from '../models/Pharmacy.js';
import { localDb } from '../config/localDb.js';
import { searchNearby } from '../services/tomtomService.js';

const router = express.Router();

// GET /api/pharmacies/nearby
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5000, filter } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: 'lat and lng required' });

    let dbPharmacies = [];
    if (mongoose.connection.readyState === 1) {
      try {
        dbPharmacies = await Pharmacy.find({
          location: {
            $near: {
              $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
              $maxDistance: parseInt(radius)
            }
          }
        }).limit(10);
      } catch (e) {}
    } else {
      dbPharmacies = localDb.find('pharmacies');
    }

    const tomtomResults = await searchNearby(parseFloat(lat), parseFloat(lng), 'pharmacy', parseInt(radius));
    let results = tomtomResults.length > 0 ? [...tomtomResults] : dbPharmacies;

    if (filter === '24hr') {
      results = results.filter(r => r.is24hr);
    } else if (filter === 'delivery') {
      results = results.filter(r => r.hasDelivery);
    }

    res.json({ dbPharmacies, nearbyResults: results.length > 0 ? results : dbPharmacies });
  } catch (error) {
    res.json({ dbPharmacies: localDb.find('pharmacies'), nearbyResults: localDb.find('pharmacies') });
  }
});

// GET /api/pharmacies
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const pharmacies = await Pharmacy.find().limit(20);
      return res.json(pharmacies);
    }
    const pharmacies = localDb.find('pharmacies');
    res.json(pharmacies);
  } catch (error) {
    res.json(localDb.find('pharmacies'));
  }
});

export default router;
