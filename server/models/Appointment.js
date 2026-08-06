import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  type: { type: String, enum: ['in-person', 'video'], default: 'in-person' },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'confirmed' },
  reason: { type: String, default: '' },
  notes: { type: String, default: '' },
  chatSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession' }
}, { timestamps: true });

appointmentSchema.index({ userId: 1, date: -1 });
appointmentSchema.index({ doctorId: 1, date: 1 });

export default mongoose.model('Appointment', appointmentSchema);
