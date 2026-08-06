import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  subSpecialties: [String],
  credentials: { type: String, default: '' }, // e.g. "MD, FACC"
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  yearsExperience: { type: Number, default: 0 },
  about: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  languages: { type: [String], default: ['English'] },
  education: [{
    degree: String,
    institution: String
  }],
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
    address: { type: String, default: '' },
    city: { type: String, default: '' }
  },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  acceptingNewPatients: { type: Boolean, default: true },
  telehealthAvailable: { type: Boolean, default: false },
  consultationFee: { type: Number, default: 0 },
  availability: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    slots: [{ start: String, end: String }]
  }],
  reviews: [{
    patientName: String,
    patientInitials: String,
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

doctorSchema.index({ location: '2dsphere' });
doctorSchema.index({ specialty: 1 });
doctorSchema.index({ rating: -1 });

export default mongoose.model('Doctor', doctorSchema);
