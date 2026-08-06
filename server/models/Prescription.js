import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  chatSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  medication: { type: String, required: true },
  genericName: { type: String, default: '' },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  route: { type: String, default: 'Oral' }, // Oral, Topical, etc.
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  duration: { type: String, default: '' }, // e.g. "7 days", "2 weeks"
  instructions: { type: String, default: '' },
  sideEffects: [String],
  warnings: [String],
  refillsRemaining: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'completed', 'discontinued'], default: 'active' }
}, { timestamps: true });

prescriptionSchema.index({ userId: 1, status: 1 });

export default mongoose.model('Prescription', prescriptionSchema);
