import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionToken: { type: String }, // for anonymous users
  messages: [messageSchema],
  diagnosis: {
    conditions: [{
      name: String,
      probability: String, // "High", "Medium", "Low"
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
      ingredients: mongoose.Schema.Types.Mixed, // String or Array
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
    phone: String,
    lat: Number,
    lng: Number
  }],
  status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active' },
  symptomTags: [String]
}, { timestamps: true });

chatSessionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('ChatSession', chatSessionSchema);
