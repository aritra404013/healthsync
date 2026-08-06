import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId: { type: String, required: true },
  doctorInfo: {
    name: { type: String, default: '' },
    specialty: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' }
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  type: { type: String, enum: ['in-person', 'video'], default: 'in-person' },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'confirmed' },
  reason: { type: String, default: '' },
  notes: { type: String, default: '' },
  chatSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession' }
}, { timestamps: true });

appointmentSchema.index({ userId: 1, date: -1 });

export default mongoose.model('Appointment', appointmentSchema);
