import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  phone: { type: String, default: '' },
  hours: { type: String, default: '' },
  openTime: { type: String, default: '08:00' },
  closeTime: { type: String, default: '21:00' },
  is24hr: { type: Boolean, default: false },
  hasDelivery: { type: Boolean, default: false },
  rating: { type: Number, default: 4.0 },
  distance: { type: Number, default: 0 } // calculated field in miles
}, { timestamps: true });

pharmacySchema.index({ location: '2dsphere' });

export default mongoose.model('Pharmacy', pharmacySchema);
