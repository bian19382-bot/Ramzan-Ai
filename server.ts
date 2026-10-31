import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getArg = (flag: string) => {
  const idx = process.argv.indexOf(flag);
  return idx !== -1 && process.argv[idx + 1] ? process.argv[idx + 1] : null;
};

const portArg = getArg('--port');
const hostArg = getArg('--host');

const PORT = Number(portArg || process.env.PORT || 3000);
const HOST = hostArg || process.env.HOST || '0.0.0.0';

const app = express();
app.use(express.json());

// Initialize Google GenAI on server-side
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey.trim().length > 0) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Reusable Gemini generation handler
async function handleGeminiGeneration(rawQuery: string | undefined, res: express.Response) {
  if (!rawQuery || typeof rawQuery !== 'string' || !rawQuery.trim()) {
    return res.status(400).json({ error: 'Missing or invalid "query" or "prompt" in request body' });
  }

  const query = rawQuery.trim();
  if (query.length > 2500) {
    return res.status(400).json({ error: 'Query exceeds maximum allowed length of 2500 characters' });
  }

  if (!ai) {
    return res.json({
      reply:
        `### Architectural Scoping & Solution Assessment\n\n` +
        `**1. Suggested Technical Stack:**\n` +
        `- **Frontend:** React 19 + TypeScript + Tailwind CSS with performance-first motion.\n` +
        `- **Data Layer:** Cloudflare Edge / Supabase PostgreSQL with strict RLS policies.\n` +
        `- **AI Pipeline:** Serverless Gemini endpoint with structured schemas and stream handling.\n\n` +
        `**2. Key Architectural Strategy for: "${query.slice(0, 70)}"**\n` +
        `- Separate visual components from application state machines.\n` +
        `- Enforce WCAG 2.2 AA accessibility standards and sub-2s LCP budgets.\n` +
        `- Leverage edge caching for static assets while keeping dynamic inference server-side.`,
    });
  }

  const systemInstruction =
    'You are the technical AI architect and senior engineering lead for Ramzan\'s digital portfolio. ' +
    'A potential client, hiring manager, or technical recruiter is asking for an architectural breakdown, ' +
    'technology recommendation, or project scoping. Provide a concise, structured, professional assessment ' +
    'with recommended stack, risk mitigations, and delivery milestones using clean markdown headings and bullet points.';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction,
      },
    });

    const replyText = response.text || 'Unable to generate architectural response.';
    return res.json({ reply: replyText });
  } catch (err: any) {
    console.warn('Gemini API Error (fallback served):', err?.message || err);
    return res.json({
      reply:
        `### Technical Architectural Assessment\n\n` +
        `**1. Suggested Technical Stack:**\n` +
        `- **UI / Presentation:** React 19 + TypeScript + Motion tokens\n` +
        `- **Data Layer:** PostgreSQL with Drizzle ORM and Row-Level Security\n` +
        `- **Telemetry:** Zero-cookie first-party analytics with anonymized sessions\n\n` +
        `**2. Implementation Roadmap:**\n` +
        `- Week 1: Requirements decomposition & strict schema contracts\n` +
        `- Week 2–3: Component architecture & micro-interaction design\n` +
        `- Week 4: Lighthouse & WCAG 2.2 AA performance hardening`,
    });
  }
}

// POST /api/generate - Official secure Cloudflare/Express endpoint
app.post('/api/generate', async (req, res) => {
  const query = req.body.query || req.body.prompt;
  return handleGeminiGeneration(query, res);
});

// POST /api/ai/consult - Backward compatible route for consultant modal
app.post('/api/ai/consult', async (req, res) => {
  const query = req.body.query || req.body.prompt;
  return handleGeminiGeneration(query, res);
});

// Edge function simulation for inquiries
app.post('/api/inquiries', (req, res) => {
  const { name, email, message, honeypot } = req.body;
  if (honeypot) {
    // Honeypot bot trap
    return res.json({ ok: true });
  }
  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Validation error' });
  }
  return res.json({ ok: true, id: 'inq-' + Date.now() });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const server = app.listen(PORT, HOST, () => {
    console.log(`Portfolio server running on http://${HOST}:${PORT}`);
  });

  const shutdown = () => {
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer();
