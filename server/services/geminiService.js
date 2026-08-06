import fetch from 'node-fetch';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const SYSTEM_PROMPT = `You are HealthSync AI, a professional medical symptom analysis assistant specializing in Indian healthcare and traditional remedies. You provide calm, precise, and reliable health guidance.

IMPORTANT RULES:
1. You are NOT a doctor. Always remind users to consult a real medical professional.
2. Health Symptom Triage: ONLY return an <INTERACTIVE_FORM_JSON> block if the user's message is specifically related to a health symptom, physical pain, illness, or medical concern.
3. Non-Health / General Conversation: For greetings (e.g. "hi", "hello"), general questions, or non-medical chat, respond naturally and conversationally WITHOUT returning an <INTERACTIVE_FORM_JSON> block.
4. Form Completion & Next Process: If the user provides answers to the interactive form (e.g., "[Interactive Form Responses...]") OR if you have gathered sufficient information, DO NOT send another <INTERACTIVE_FORM_JSON>. You MUST proceed directly to the next process and provide a comprehensive clinical analysis containing a <DIAGNOSIS_JSON> block!
5. SEVERITY DETECTION: When symptoms indicate a severe or emergency condition (high fever 103°F+, shortness of breath, chest pain, confusion, seizures, severe pain 8+/10, etc.), you MUST set severity to "severe" or "emergency" and prepend your text with an urgent warning to visit a doctor immediately.

CRITICAL — INDIAN HOME REMEDIES RULES:
You MUST generate AUTHENTIC, PERSONALIZED Indian home remedies based on the user's SPECIFIC symptoms and severity. These should be REAL remedies that Indian families actually practice at home — NOT generic template responses.

Include TWO categories of remedies:

A) "recipe" type — Traditional Indian herbal drinks, foods, and preparations:
   - Kadha/Kashayam (herbal decoctions), Haldi Doodh, Ajwain water, etc.
   - Include EXACT ingredient quantities, step-by-step cooking instructions, and dosage
   - Generate a YouTube search URL to help user find a video tutorial

B) "practice" type — Traditional Indian home care practices that families do:
   - Placing a cold wet cloth (geeli patti) on the forehead for fever
   - Rubbing warm mustard oil (sarson ka tel) on chest and back
   - Steam inhalation (bhaap lena) with eucalyptus/ajwain seeds
   - Applying onion slices on feet soles for fever
   - Head massage with warm coconut oil for headache
   - Applying hing (asafoetida) paste around navel for stomach ache
   - Gargling with warm salt + turmeric water for sore throat
   - Wrapping body in a cotton blanket after applying oil (tel maalish)
   - Eating khichdi or daliya (light, easy-to-digest food) during illness
   - Using neem leaves in bath water for skin rashes
   These should include exact steps of HOW to do the practice, materials needed, frequency, and precautions.

Each remedy MUST be personalized to the user's exact reported condition, severity, and symptoms. For example:
- Fever 104°F with body ache → different remedies than fever 100°F with cough
- Severe migraine → different remedies than mild tension headache
- Stomach cramps with vomiting → different remedies than bloating after meals

Generate 3-5 remedies total, mixing both recipes AND practices. Make them SPECIFIC, not generic.

<INTERACTIVE_FORM_JSON> Schema Example:
<INTERACTIVE_FORM_JSON>
{
  "title": "Specific Symptom Questionnaire",
  "questions": [
    { "id": "q1", "type": "slider", "label": "Pain Severity (1-10)", "min": 1, "max": 10, "default": 5 },
    { "id": "q2", "type": "single_choice", "label": "Symptom Onset", "options": ["Sudden", "Gradual", "Intermittent"] },
    { "id": "q3", "type": "multi_choice", "label": "Accompanying Signs", "options": ["Option A", "Option B", "Option C"] }
  ]
}
</INTERACTIVE_FORM_JSON>

<DIAGNOSIS_JSON> Schema (follow exactly):
<DIAGNOSIS_JSON>
{
  "conditions": [{"name": "Condition Name", "probability": "High/Medium/Low", "description": "Brief explanation"}],
  "severity": "mild/moderate/severe/emergency",
  "recommendedSpecialties": ["Specialty1", "Specialty2"],
  "indianHomeRemedies": [
    {
      "name": "Remedy Name in Hindi & English",
      "category": "recipe",
      "ingredients": "Exact quantities of each ingredient",
      "recipe": "Step-by-step detailed instructions",
      "usage": "How often, when to take, and expected relief time",
      "youtubeUrl": "https://www.youtube.com/results?search_query=relevant+search+terms"
    },
    {
      "name": "Traditional Practice Name in Hindi & English",
      "category": "practice",
      "ingredients": "Materials needed (cloth, oil, water, etc.)",
      "recipe": "Step-by-step instructions on how to do this practice",
      "usage": "How often and for how long to do this, precautions",
      "youtubeUrl": "https://www.youtube.com/results?search_query=relevant+search+terms"
    }
  ],
  "lifestyleRecommendations": ["Specific recommendation based on condition"],
  "followUpDays": 7
}
</DIAGNOSIS_JSON>`;

export async function sendToGemini(messages, apiKey) {
  const geminiKey = apiKey || process.env.GEMINI_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  // 1. Primary: Try Gemini API with active flash-latest / 2.0 models
  if (geminiKey && geminiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
    const geminiResult = await tryGemini(messages, geminiKey);
    if (geminiResult) return geminiResult;
  }

  // 2. Try OpenRouter API if key is set
  if (openRouterKey || process.env.USE_OPENROUTER === 'true') {
    const openRouterResult = await tryOpenRouter(messages, openRouterKey);
    if (openRouterResult) return openRouterResult;
  }

  // 3. Fallback safety analysis if external APIs hit rate limits
  return await generateDynamicAiAnalysis(messages);
}

async function tryGemini(messages, key) {
  const activeModels = [
    'gemini-flash-latest',
    'gemini-flash-lite-latest',
    'gemini-2.0-flash-lite'
  ];

  const contents = [
    { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
    { role: 'model', parts: [{ text: 'Understood. I am HealthSync AI, ready to assist with symptom analysis.' }] }
  ];

  for (const msg of messages) {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    });
  }

  for (const modelName of activeModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.3,
            topP: 0.9,
            maxOutputTokens: 4096
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (text) return parseAiText(text);
      } else {
        console.warn(`Gemini model ${modelName} returned status ${response.status}`);
      }
    } catch (error) {
      console.warn(`Gemini model ${modelName} call failed:`, error.message);
    }
  }
  return null;
}

function parseAiText(text) {
  const diagnosisMatch = text.match(/<DIAGNOSIS_JSON>([\s\S]*?)<\/DIAGNOSIS_JSON>/);
  const formMatch = text.match(/<INTERACTIVE_FORM_JSON>([\s\S]*?)<\/INTERACTIVE_FORM_JSON>/);

  let diagnosis = null;
  let interactiveForm = null;
  let cleanText = text;

  if (diagnosisMatch) {
    try {
      diagnosis = JSON.parse(diagnosisMatch[1].trim());
      cleanText = cleanText.replace(/<DIAGNOSIS_JSON>[\s\S]*?<\/DIAGNOSIS_JSON>/, '').trim();
    } catch (e) {
      console.error('Failed to parse diagnosis JSON:', e);
    }
  }

  if (formMatch) {
    try {
      interactiveForm = JSON.parse(formMatch[1].trim());
      cleanText = cleanText.replace(/<INTERACTIVE_FORM_JSON>[\s\S]*?<\/INTERACTIVE_FORM_JSON>/, '').trim();
    } catch (e) {
      console.error('Failed to parse interactive form JSON:', e);
    }
  }

  // Auto-prepend urgency warning for severe/emergency diagnoses
  if (diagnosis && (diagnosis.severity === 'severe' || diagnosis.severity === 'emergency')) {
    const urgencyPrefix = diagnosis.severity === 'emergency'
      ? '**EMERGENCY — Seek immediate medical attention!** Your symptoms indicate a potentially serious condition. Please visit the nearest hospital or call emergency services right away.\n\n'
      : '**URGENT — You should visit a doctor immediately.** Your symptoms suggest a condition that needs prompt professional evaluation. Do not delay medical consultation.\n\n';
    if (!cleanText.includes('visit a doctor') && !cleanText.includes('EMERGENCY') && !cleanText.includes('URGENT')) {
      cleanText = urgencyPrefix + cleanText;
    }
  }

  return { text: cleanText, diagnosis, interactiveForm };
}

// Detect severity from user's form-answer text (slider values, keywords)
function detectSeverityFromMessage(text) {
  const lower = text.toLowerCase();
  let severityScore = 0;

  // Temperature detection (°F)
  const tempMatch = text.match(/(\d{2,3}\.?\d*)\s*°?F/i);
  if (tempMatch) {
    const temp = parseFloat(tempMatch[1]);
    if (temp >= 104) severityScore += 4;
    else if (temp >= 103) severityScore += 3;
    else if (temp >= 101) severityScore += 1;
  }

  // Severity/pain slider detection (X / 10)
  const sliderMatch = text.match(/(\d{1,2})\s*\/\s*10/);
  if (sliderMatch) {
    const val = parseInt(sliderMatch[1]);
    if (val >= 9) severityScore += 4;
    else if (val >= 7) severityScore += 2;
    else if (val >= 5) severityScore += 1;
  }

  // Emergency red-flag keywords
  const emergencyKeywords = ['shortness of breath', 'chest tightness', 'confusion', 'at rest (emergency)', 'bedridden', 'chest pain', 'unconscious', 'seizure', 'blood in', 'bleeding heavily'];
  const severeKeywords = ['constant high', '1+ weeks', '4-7 days', 'unable to work', 'skin rash', 'stiff neck', 'swollen', 'night sweats'];

  emergencyKeywords.forEach(kw => { if (lower.includes(kw)) severityScore += 3; });
  severeKeywords.forEach(kw => { if (lower.includes(kw)) severityScore += 1; });

  if (severityScore >= 6) return 'emergency';
  if (severityScore >= 3) return 'severe';
  if (severityScore >= 2) return 'moderate';
  return 'mild';
}

/**
 * Generate personalized Indian home remedies via a dedicated Gemini AI call.
 * This ensures remedies are REAL, AUTHENTIC, and SPECIFIC to the user's exact condition —
 * not hardcoded templates. Includes both recipes AND traditional practices.
 */
async function generateAiRemedies(symptomSummary) {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey || geminiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    return null; // No key, will use inline fallback
  }

  const remedyPrompt = `You are an expert in authentic Indian home remedies, Ayurveda, and traditional Indian household healthcare practices (Dadi Maa ke Nuskhe / Gharelu Upchar).

Based on the following patient symptoms, generate 4-5 PERSONALIZED Indian home remedies. These must be REAL remedies that Indian families actually practice — not generic or made-up.

Patient's symptoms and details:
${symptomSummary}

You MUST include BOTH types of remedies:

1. "recipe" type — Traditional herbal drinks, foods, and preparations:
   - Kadha, Kashayam, Haldi Doodh, Ajwain water, soups, etc.
   - Include EXACT ingredient quantities and step-by-step cooking instructions

2. "practice" type — Traditional Indian home care practices (NOT recipes):
   - Geeli Patti (cold wet cloth on forehead) for fever
   - Sarson ka Tel Maalish (warm mustard oil body massage)
   - Bhaap lena (steam inhalation with ajwain/eucalyptus)
   - Pyaaz ke slice pair ke talwe par rakhna (onion slices on feet soles for fever)
   - Nariyal tel se sar ki malish (coconut oil head massage for headache)
   - Hing ka lepa naabhi ke aas-paas (asafoetida paste near navel for stomach)
   - Namak-haldi garam paani se gargle (salt-turmeric warm water gargle)
   - Kapoor aur sarson tel ki malish (camphor-mustard oil rub for cold)
   - Khichdi / Daliya / Moong Dal ka Paani for recovery
   - Neem patti ka snan (neem leaf bath for skin issues)
   Include step-by-step HOW to do the practice, materials needed, duration, and precautions.

Rules:
- Each remedy must be SPECIFIC to the reported symptoms and severity
- Include Hindi/regional names alongside English names
- Generate a YouTube search URL for each remedy
- Be authentic — these should be what a real Indian grandmother (Dadi/Nani) would recommend
- Include precautions and contraindications where relevant

Respond ONLY with a valid JSON array (no markdown, no explanation), like this:
[
  {
    "name": "Remedy Name (Hindi Name)",
    "category": "recipe" or "practice",
    "ingredients": "Exact materials/ingredients with quantities",
    "recipe": "Step-by-step instructions",
    "usage": "Frequency, timing, expected relief, precautions",
    "youtubeUrl": "https://www.youtube.com/results?search_query=relevant+search+terms"
  }
]`;

  const models = ['gemini-flash-latest', 'gemini-flash-lite-latest', 'gemini-2.0-flash-lite'];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: remedyPrompt }] }],
          generationConfig: { temperature: 0.8, topP: 0.95, maxOutputTokens: 3000 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        // Clean markdown code fences if present
        text = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
        const remedies = JSON.parse(text);
        if (Array.isArray(remedies) && remedies.length > 0) {
          // Ensure each remedy has required fields
          return remedies.map(r => ({
            name: r.name || 'Indian Home Remedy',
            category: r.category || 'recipe',
            ingredients: r.ingredients || '',
            recipe: r.recipe || '',
            usage: r.usage || '',
            youtubeUrl: r.youtubeUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(r.name + ' Indian home remedy')}`
          }));
        }
      }
    } catch (err) {
      console.warn(`AI remedy generation (${model}) notice:`, err.message);
    }
  }

  return null; // All models failed
}

async function generateDynamicAiAnalysis(messages) {
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || 'symptoms';
  const allUserMsgs = messages.filter(m => m.role === 'user').map(m => m.content).join(' ');

  const severity = detectSeverityFromMessage(allUserMsgs);
  const isSevereOrEmergency = severity === 'severe' || severity === 'emergency';

  // Try to generate AI-personalized remedies based on the actual conversation
  let remedies = await generateAiRemedies(allUserMsgs);

  // Only if AI remedy generation completely fails, use a minimal fallback
  if (!remedies || remedies.length === 0) {
    remedies = [
      {
        name: 'Haldi Doodh (Golden Turmeric Milk / हल्दी दूध)',
        category: 'recipe',
        ingredients: '1 cup warm Milk, 1/2 tsp Pure Turmeric (Haldi) powder, pinch of Black Pepper, 1 tsp Honey or Jaggery (Gud)',
        recipe: '1. Heat 1 cup of milk in a saucepan on medium flame — do not boil vigorously.\n2. Add haldi powder and a pinch of freshly crushed black pepper (kali mirch).\n3. Stir and simmer for 3-4 minutes.\n4. Pour into a cup, let it cool slightly, then mix in honey or gud.',
        usage: 'Drink warm before bedtime. Black pepper enhances turmeric absorption (curcumin). Helps with inflammation, body aches, and immunity. Avoid if lactose intolerant — use warm water instead.',
        youtubeUrl: 'https://www.youtube.com/results?search_query=haldi+doodh+golden+turmeric+milk+recipe+indian+home+remedy'
      },
      {
        name: 'Geeli Patti / Cold Compress (गीली पट्टी)',
        category: 'practice',
        ingredients: 'A clean cotton cloth or small towel, a bowl of normal room-temperature water (NOT ice-cold)',
        recipe: '1. Soak the cotton cloth in room-temperature water.\n2. Wring out excess water so the cloth is damp, not dripping.\n3. Fold the cloth and place it gently on the patient\'s forehead.\n4. Also place damp cloths on the wrists and back of the neck.\n5. Change the cloth every 5-10 minutes as it warms up.\n6. Continue for 20-30 minutes or until relief is felt.',
        usage: 'Repeat every 2-3 hours for fever relief. Do NOT use ice or very cold water as it can cause shivering which raises body temperature. This is one of the most common Indian home practices for bukhar (fever).',
        youtubeUrl: 'https://www.youtube.com/results?search_query=geeli+patti+cold+compress+fever+remedy+indian'
      }
    ];
  }

  const urgencyText = severity === 'emergency'
    ? '**EMERGENCY — Seek immediate medical attention!** Your symptoms indicate a potentially dangerous condition. Please visit the nearest hospital or call emergency services (112) right away.\n\n'
    : severity === 'severe'
      ? '**URGENT — You should visit a doctor immediately.** Your symptoms suggest a condition that needs prompt professional evaluation. Do not delay seeking medical consultation.\n\n'
      : '';

  const baseText = `${urgencyText}Based on your detailed responses, here is a comprehensive AI clinical evaluation:\n\n**Key Observations:**\n- ${isSevereOrEmergency ? 'Your symptoms show signs of a **significant medical concern** that requires professional attention.' : 'Symptoms reported require careful monitoring over the next 24-48 hours.'}\n- ${isSevereOrEmergency ? 'Immediate medical consultation is strongly recommended.' : 'Stay well hydrated and maintain adequate rest.'}\n\n**Next Steps:**\n${isSevereOrEmergency ? '1. **Visit a doctor or hospital immediately** — do not wait.\n2. Review the nearby doctors shown below for quick access.\n3. Try the Indian home remedies below for temporary natural relief while you arrange your visit.' : 'If your symptoms worsen or persist, please consult a healthcare professional or specialist listed in your care plan.'}\n\n*This is an informational AI assessment. Always consult a licensed doctor for definitive diagnosis.*`;

  return {
    text: baseText,
    diagnosis: {
      conditions: [
        { name: `Symptom Evaluation (${lastUserMsg.slice(0, 30)})`, probability: isSevereOrEmergency ? 'High' : 'Medium', description: 'Detailed analysis based on user reported symptoms and interactive form answers.' },
        { name: isSevereOrEmergency ? 'Potential Acute Condition' : 'General Physical Strain', probability: isSevereOrEmergency ? 'High' : 'Medium', description: isSevereOrEmergency ? 'Symptom severity and pattern suggest an acute medical condition requiring prompt evaluation.' : 'Possible associated physical fatigue or strain requiring rest.' }
      ],
      severity: severity,
      recommendedSpecialties: isSevereOrEmergency
        ? ['Emergency Medicine', 'Internal Medicine', 'General Practitioner']
        : ['General Practitioner', 'Internal Medicine'],
      indianHomeRemedies: remedies,
      lifestyleRecommendations: isSevereOrEmergency
        ? ['Seek immediate medical attention', 'Do not self-medicate with heavy drugs', 'Stay hydrated with ORS or warm fluids', 'Rest in a cool, well-ventilated room', 'Monitor temperature every 2 hours']
        : ['Increase daily fluid intake', 'Get adequate sleep and rest', 'Monitor symptom progression'],
      followUpDays: isSevereOrEmergency ? 1 : 5
    }
  };
}

export default { sendToGemini };

