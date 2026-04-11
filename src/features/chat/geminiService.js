import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ENV_MODEL = import.meta.env.VITE_GEMINI_MODEL;
const MODEL_CANDIDATES = Array.from(
  new Set(
    [
      ENV_MODEL,
      'gemini-2.5-flash',
      'gemini-flash-latest',
      'gemini-2.0-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash',
    ].filter(Boolean)
  )
);

const SYSTEM_INSTRUCTION = [
  'You are CampusSync Assistant, an AI helper for campus room booking and operations.',
  'Be concise, accurate, and practical.',
  'When live app data is provided, prioritize that data over assumptions.',
  'If unsure, acknowledge uncertainty and suggest where to verify in the app.',
  'Never provide legal, medical, or financial advice.',
].join(' ');

let cachedModel = null;
let cachedModelName = null;
let lastRequestAt = 0;

const toGeminiRole = (role) => (role === 'assistant' ? 'model' : 'user');

const normalizeHistory = (history) => {
  if (!Array.isArray(history)) return [];

  const normalized = history
    .filter(
      (item) => item && typeof item.content === 'string' && item.content.trim()
    )
    .slice(-8)
    .map((item) => ({
      role: toGeminiRole(item.role),
      parts: [{ text: item.content.trim().slice(0, 1500) }],
    }));

  // Gemini chat history must begin with a user turn.
  while (normalized.length && normalized[0].role !== 'user') {
    normalized.shift();
  }

  // Merge accidental consecutive same-role turns to keep a clean alternation.
  const merged = [];
  for (const item of normalized) {
    const last = merged[merged.length - 1];
    if (last && last.role === item.role) {
      const lastText = last.parts?.[0]?.text || '';
      const nextText = item.parts?.[0]?.text || '';
      last.parts = [{ text: `${lastText}\n${nextText}`.trim().slice(0, 1500) }];
    } else {
      merged.push(item);
    }
  }

  return merged;
};

const sanitizeContext = (context = {}) => {
  if (!context || typeof context !== 'object') return {};

  const safe = {};
  if (typeof context.route === 'string')
    safe.route = context.route.slice(0, 120);
  if (typeof context.role === 'string') safe.role = context.role.slice(0, 40);
  if (typeof context.resourceType === 'string')
    safe.resourceType = context.resourceType.slice(0, 60);

  if (context.liveData && typeof context.liveData === 'object') {
    safe.liveData = JSON.stringify(context.liveData).slice(0, 2500);
  }

  return safe;
};

const isModelNotFoundError = (error) => {
  const message = String(error?.message || '').toLowerCase();
  return message.includes('[404') || message.includes('is not found');
};

const getModel = (modelName) => {
  if (!GEMINI_API_KEY) {
    throw new Error(
      'Gemini key is missing. Add VITE_GEMINI_API_KEY in .env.local and restart the app.'
    );
  }

  if (!cachedModel || cachedModelName !== modelName) {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    cachedModel = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: SYSTEM_INSTRUCTION,
    });
    cachedModelName = modelName;
  }

  return cachedModel;
};

export const askCampusAssistant = async ({
  message,
  history = [],
  context = {},
}) => {
  const cleanMessage = typeof message === 'string' ? message.trim() : '';
  if (!cleanMessage) {
    throw new Error('Please enter a valid message.');
  }

  if (cleanMessage.length > 2000) {
    throw new Error('Message is too long.');
  }

  const now = Date.now();
  if (now - lastRequestAt < 1200) {
    throw new Error(
      'You are sending messages too quickly. Please wait a moment.'
    );
  }
  lastRequestAt = now;

  const safeContext = sanitizeContext(context);
  const contextBits = [];
  if (safeContext.role) contextBits.push(`role=${safeContext.role}`);
  if (safeContext.route) contextBits.push(`route=${safeContext.route}`);
  if (safeContext.resourceType)
    contextBits.push(`resourceType=${safeContext.resourceType}`);

  const prompt = [
    contextBits.length ? `Client context: ${contextBits.join(', ')}.` : '',
    safeContext.liveData ? `Live app data: ${safeContext.liveData}` : '',
    `User message: ${cleanMessage}`,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    let lastModelError = null;
    const normalizedHistory = normalizeHistory(history);

    for (const modelName of MODEL_CANDIDATES) {
      try {
        const model = getModel(modelName);
        const chat = model.startChat({ history: normalizedHistory });
        const response = await chat.sendMessage(prompt);
        const reply = response.response.text().trim();
        return reply || 'I could not generate a response right now.';
      } catch (modelError) {
        if (!isModelNotFoundError(modelError)) {
          throw modelError;
        }
        lastModelError = modelError;
      }
    }

    throw (
      lastModelError ||
      new Error(
        'No compatible Gemini model is currently available for this key.'
      )
    );
  } catch (error) {
    throw new Error(
      error?.message || 'Assistant is currently unavailable. Please try again.'
    );
  }
};
