/**
 * Executor Agent
 * Takes a content plan from Planner and generates a social media post using Gemini.
 */
const { GoogleGenAI, Type } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const { logAiCall } = require('./logger');

let lastCallTime = 0;
const CALL_COOLDOWN = 2000;

function checkCooldown() {
  const now = Date.now();
  if (now - lastCallTime < CALL_COOLDOWN) {
    throw new Error('AI Call Rate Limit: Please wait before the next request.');
  }
  lastCallTime = now;
}

const dayContentSchema = {
  type: Type.OBJECT,
  properties: {
    caption: { type: Type.STRING },
    hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
    recommendedTime: { type: Type.STRING },
    timingReason: { type: Type.STRING }
  },
  required: ["caption", "hashtags", "recommendedTime", "timingReason"]
};

async function generatePost(plan) {
  const prompt = `You are an expert Social Media Strategist and Copywriter.
Write a highly engaging social media post based on the following:
Topic: "${plan.topic}"
Persona: "${plan.persona}"
Tone: "${plan.tone}"
Style: "${plan.style}"
Keywords: ${plan.keywords.join(', ')}

Your task:
1. Write a captivating caption following the persona and tone.
2. Provide up to 7 highly relevant hashtags.
3. Suggest the BEST time to post this content (e.g., "10:30 AM", "06:45 PM") and provide a short, data-backed reason for this suggestion (e.g., "High engagement for Professional content on weekdays").

Output must be valid JSON matching the provided schema.`;

  checkCooldown();
  logAiCall('GENERATE_POST_WITH_TIMING', { topic: plan.topic, persona: plan.persona });

  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseMimeType: 'application/json',
      responseSchema: dayContentSchema
    }
  });

  const parsed = JSON.parse(response.text);

  return {
    caption: parsed.caption,
    hashtags: parsed.hashtags,
    recommendedTime: parsed.recommendedTime,
    timingReason: parsed.timingReason,
    tone: plan.tone,
    style: plan.style,
    topic: plan.topic,
    persona: plan.persona,
    generatedAt: new Date().toISOString(),
  };
}

module.exports = { generatePost };
