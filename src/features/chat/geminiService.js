import { GoogleGenerativeAI } from '@google/generative-ai';

const getGeminiApiKey = () =>
  String(import.meta.env.VITE_GEMINI_API_KEY || '').trim();
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
let cachedKeySignature = null;
let lastRequestAt = 0;

const REQUEST_TIMEOUT_MS = 16000;
const MAX_TRANSIENT_RETRIES = 2;

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

const getErrorMessage = (error) => String(error?.message || '').toLowerCase();

const isLeakedApiKeyError = (error) => {
  const message = getErrorMessage(error);
  return (
    message.includes('[403') &&
    (message.includes('api key was reported as leaked') ||
      message.includes('reported as leaked'))
  );
};

const isUnauthorizedApiKeyError = (error) => {
  const message = getErrorMessage(error);
  return (
    message.includes('[401') ||
    message.includes('unauthenticated') ||
    message.includes('invalid api key') ||
    message.includes('permission_denied')
  );
};

const isRateLimitError = (error) => {
  const message = getErrorMessage(error);
  return (
    message.includes('[429') ||
    message.includes('resource_exhausted') ||
    message.includes('quota')
  );
};

const isTimeoutError = (error) => {
  const message = getErrorMessage(error);
  return message.includes('timeout');
};

const isServiceTemporaryError = (error) => {
  const message = getErrorMessage(error);
  return (
    message.includes('[500') ||
    message.includes('[503') ||
    message.includes('internal') ||
    message.includes('service unavailable')
  );
};

const isNetworkError = (error) => {
  const message = getErrorMessage(error);
  return (
    message.includes('failed to fetch') ||
    message.includes('networkerror') ||
    message.includes('network request failed')
  );
};

const isRetryableError = (error) =>
  isServiceTemporaryError(error) ||
  isTimeoutError(error) ||
  isNetworkError(error);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const withTimeout = async (fn, timeoutMs = REQUEST_TIMEOUT_MS) => {
  let timeoutId;
  try {
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`Chat request timeout after ${timeoutMs / 1000}s.`));
      }, timeoutMs);
    });

    return await Promise.race([fn(), timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

const getKeySignature = (key) => `${key.slice(0, 4)}:${key.length}`;

const mapGeminiError = (error) => {
  if (isLeakedApiKeyError(error)) {
    return new Error(
      'Gemini API key has been disabled because it was reported as leaked. Create a new key in Google AI Studio, update VITE_GEMINI_API_KEY in .env.local, and restart the app.'
    );
  }

  if (isUnauthorizedApiKeyError(error)) {
    return new Error(
      'Gemini API key is invalid or unauthorized. Update VITE_GEMINI_API_KEY in .env.local and restart the app.'
    );
  }

  if (isRateLimitError(error)) {
    return new Error(
      'Gemini is rate limited right now. Please try again in a moment.'
    );
  }

  if (isTimeoutError(error)) {
    return new Error('Assistant request timed out. Please try again.');
  }

  if (isNetworkError(error)) {
    return new Error(
      'Network issue while contacting Gemini. Check your connection and retry.'
    );
  }

  if (isServiceTemporaryError(error)) {
    return new Error(
      'Gemini service is temporarily unavailable. Please retry.'
    );
  }

  return new Error(
    error?.message || 'Assistant is currently unavailable. Please try again.'
  );
};

const getModel = (modelName) => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error(
      'Gemini key is missing. Add VITE_GEMINI_API_KEY in .env.local and restart the app.'
    );
  }

  const keySignature = getKeySignature(apiKey);
  if (cachedModel && cachedKeySignature !== keySignature) {
    cachedModel = null;
    cachedModelName = null;
  }

  if (!cachedModel || cachedModelName !== modelName) {
    const genAI = new GoogleGenerativeAI(apiKey);
    cachedModel = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: SYSTEM_INSTRUCTION,
    });
    cachedModelName = modelName;
    cachedKeySignature = keySignature;
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
    let attempt = 0;
    while (attempt <= MAX_TRANSIENT_RETRIES) {
      try {
        let lastModelError = null;
        const normalizedHistory = normalizeHistory(history);

        for (const modelName of MODEL_CANDIDATES) {
          try {
            const model = getModel(modelName);
            const chat = model.startChat({ history: normalizedHistory });
            const response = await withTimeout(() => chat.sendMessage(prompt));
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
        if (isRetryableError(error) && attempt < MAX_TRANSIENT_RETRIES) {
          attempt += 1;
          await wait(attempt * 500);
          continue;
        }
        throw error;
      }
    }

    throw new Error('Assistant is currently unavailable. Please try again.');
  } catch (error) {
    throw mapGeminiError(error);
  }
};
