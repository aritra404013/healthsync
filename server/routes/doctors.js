import express from 'express';
import mongoose from 'mongoose';
import Doctor from '../models/Doctor.js';
import { localDb } from '../config/localDb.js';
import { searchNearby } from '../services/tomtomService.js';

const router = express.Router();

// GET /api/doctors — List all doctors or filter
router.get('/', async (req, res) => {
  try {
    const { specialty, search, limit = 20 } = req.query;
    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (specialty) query.specialty = new RegExp(specialty, 'i');
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { specialty: new RegExp(search, 'i') },
          { subSpecialties: { $in: [new RegExp(search, 'i')] } }
        ];
      }
      const doctors = await Doctor.find(query).limit(parseInt(limit)).sort({ rating: -1 });
      return res.json(doctors);
    }

    const query = {};
    if (specialty) query.specialty = specialty;
    if (search) query.name = search;
    const docs = localDb.find('doctors', query);
    res.json(docs.slice(0, parseInt(limit)));
  } catch (error) {
    res.json(localDb.find('doctors'));
  }
});

// GET /api/doctors/search-live — Real-time TomTom & Overpass POI doctor search
router.get('/search-live', async (req, res) => {
  try {
    let { city, lat, lng, radius = 10000 } = req.query;

    if (city && (!lat || !lng)) {
      const geo = await geocodeAddress(city);
      if (geo) {
        lat = geo.lat;
        lng = geo.lng;
      } else {
        // Default to Mumbai center if city not found
        lat = 19.0760;
        lng = 72.8777;
      }
    }

    if (!lat || !lng) {
      lat = 19.0760;
      lng = 72.8777;
    }

    const liveResults = await searchNearby(parseFloat(lat), parseFloat(lng), 'doctor', parseInt(radius));
    
    if (liveResults && liveResults.length > 0) {
      // Upsert live doctors into localDb so findById can resolve them
      liveResults.forEach(doc => {
        const docId = doc._id || doc.id;
        const existing = localDb.findById('doctors', docId);
        if (!existing) {
          localDb.insert('doctors', doc);
        }
      });
      return res.json(liveResults);
    }

    // Fallback database doctors if API search returns empty
    const dbDocs = localDb.find('doctors');
    res.json(dbDocs);
  } catch (error) {
    console.error('Live search route error:', error);
    res.json(localDb.find('doctors'));
  }
});

// GET /api/doctors/nearby — Find nearby doctors via TomTom or database
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: 'lat and lng required' });

    const tomtomResults = await searchNearby(parseFloat(lat), parseFloat(lng), 'doctor', parseInt(radius));
    if (tomtomResults && tomtomResults.length > 0) {
      tomtomResults.forEach(doc => {
        const docId = doc._id || doc.id;
        if (!localDb.findById('doctors', docId)) {
          localDb.insert('doctors', doc);
        }
      });
    }
    res.json({ dbDoctors: tomtomResults, nearbyResults: tomtomResults });
  } catch (error) {
    res.json({ dbDoctors: localDb.find('doctors'), nearbyResults: localDb.find('doctors') });
  }
});

// GET /api/doctors/:id — Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const doctor = await Doctor.findById(id);
      if (doctor) return res.json(doctor);
    }
    const found = localDb.findById('doctors', id);
    if (found) return res.json(found);

    return res.status(404).json({ message: 'Doctor not found' });
  } catch (error) {
    return res.status(404).json({ message: 'Doctor not found' });
  }
});

export default router;
