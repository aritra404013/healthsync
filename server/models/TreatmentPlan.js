import mongoose from 'mongoose';

const treatmentPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession' },
  title: { type: String, default: 'Treatment Plan' },
  diagnosis: {
    conditions: [{
      name: String,
      probability: String,
      description: String
    }],
    severity: { type: String, enum: ['mild', 'moderate', 'severe', 'emergency', ''], default: '' },
    recommendedSpecialties: [String],
    suggestedMedications: [{
      name: String,
      dosage: String,
      frequency: String,
      notes: String
    }],
    lifestyleRecommendations: [String],
    followUpDays: { type: Number, default: 7 },
    indianHomeRemedies: [{
      name: String,
      category: { type: String, enum: ['recipe', 'practice'], default: 'recipe' },
      ingredients: mongoose.Schema.Types.Mixed,
      recipe: String,
      usage: String,
      youtubeUrl: String
    }]
  },
  nearbyDoctors: [{
    name: String,
    specialty: String,
    address: String,
    distance: String,
    rating: Number,
    phone: String
  }],
  notes: { type: String, default: '' },
  status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active' }
}, { timestamps: true });

treatmentPlanSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('TreatmentPlan', treatmentPlanSchema);
