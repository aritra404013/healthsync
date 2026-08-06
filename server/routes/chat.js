import express from 'express';
import mongoose from 'mongoose';
import ChatSession from '../models/ChatSession.js';
import { localDb } from '../config/localDb.js';
import { sendToGemini } from '../services/geminiService.js';
import { searchNearby } from '../services/tomtomService.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/message', optionalAuth, async (req, res) => {
  try {
    const { message, sessionId, lat, lng } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    let session;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (sessionId) {
      if (isDbConnected) {
        session = await ChatSession.findById(sessionId);
      } else {
        session = localDb.findById('chatSessions', sessionId);
      }
    }
    
    if (!session) {
      const newSession = {
        userId: req.user?._id || null,
        sessionToken: !req.user ? `anon_${Date.now()}_${Math.random().toString(36).slice(2)}` : undefined,
        messages: [],
        symptomTags: [],
        status: 'active'
      };
      
      if (isDbConnected) {
        session = new ChatSession(newSession);
      } else {
        session = localDb.insert('chatSessions', newSession);
      }
    }

    // Add user message
    session.messages.push({ role: 'user', content: message });

    // Extract symptom keywords
    const symptomKeywords = ['headache', 'fever', 'cough', 'pain', 'nausea', 'fatigue', 'dizziness', 'rash', 'swelling', 'shortness of breath', 'chest pain', 'stomach', 'back pain', 'sore throat', 'insomnia'];
    const msgLower = message.toLowerCase();
    symptomKeywords.forEach(kw => {
      if (msgLower.includes(kw) && !session.symptomTags.includes(kw)) {
        session.symptomTags.push(kw);
      }
    });

    // Send conversation to OpenRouter / Gemini AI engine
    const conversationMessages = session.messages.map(m => ({ role: m.role, content: m.content }));
    const aiResponse = await sendToGemini(conversationMessages);

    // Add AI response
    session.messages.push({ role: 'assistant', content: aiResponse.text });

    // Update diagnosis if generated
    if (aiResponse.diagnosis) {
      session.diagnosis = aiResponse.diagnosis;
      session.status = 'completed';
    }

    // Auto-fetch nearby doctors when severity is severe/emergency and GPS coords are provided
    let nearbyDoctors = null;
    const severity = aiResponse.diagnosis?.severity;
    if ((severity === 'severe' || severity === 'emergency') && lat && lng) {
      try {
        const doctors = await searchNearby(parseFloat(lat), parseFloat(lng), 'doctor', 10000);
        if (doctors && doctors.length > 0) {
          nearbyDoctors = doctors.slice(0, 5); // Top 5 nearest doctors
        }
      } catch (docErr) {
        console.warn('Auto nearby-doctor fetch notice:', docErr.message);
      }
    }

    if (isDbConnected) {
      await session.save();
    } else {
      localDb.update('chatSessions', session._id, {
        messages: session.messages,
        symptomTags: session.symptomTags,
        diagnosis: session.diagnosis,
        status: session.status
      });
    }

    res.json({
      sessionId: session._id,
      response: aiResponse.text,
      diagnosis: aiResponse.diagnosis || null,
      interactiveForm: aiResponse.interactiveForm || null,
      nearbyDoctors: nearbyDoctors,
      status: session.status
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/chat/sessions — Get user's chat sessions
router.get('/sessions', optionalAuth, async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected) {
      const query = req.user ? { userId: req.user._id } : {};
      const sessions = await ChatSession.find(query)
        .select('status symptomTags diagnosis.severity createdAt')
        .sort({ createdAt: -1 })
        .limit(20);
      return res.json(sessions);
    }
    const sessions = localDb.find('chatSessions');
    res.json(sessions.slice(0, 20));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/chat/sessions/:id — Get specific session
router.get('/sessions/:id', optionalAuth, async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let session;
    if (isDbConnected) {
      session = await ChatSession.findById(req.params.id);
    } else {
      session = localDb.findById('chatSessions', req.params.id);
    }
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
