import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

import fs from 'fs';

dotenv.config({ path: ['.env.local', '.env'] });

// Auto-clean any unwanted lockfiles once on startup so bun.lock can never linger
const purgeLockfiles = () => {
  ['bun.lock', 'bun.lockb', 'yarn.lock', 'pnpm-lock.yaml'].forEach((f) => {
    try {
      if (fs.existsSync(f)) {
        fs.unlinkSync(f);
        console.log(`[Auto-clean] Removed ${f} to prevent Cloudflare build failure.`);
      }
    } catch {}
  });
};

purgeLockfiles();

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

// Payload body size limit (50kb)
app.use(express.json({ limit: '50kb' }));

// In-memory rate limiter: 20 req/min per IP on /api/*
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();

const apiRateLimiter = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 20;

  const current = rateLimitMap.get(ip);
  if (!current || now > current.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return next();
  }

  if (current.count >= maxRequests) {
    const retryAfterSec = Math.ceil((current.resetAt - now) / 1000);
    res.setHeader('Retry-After', retryAfterSec.toString());
    return res.status(429).json({
      error: 'Rate limit reached. Thori der baad try karein (20 requests per minute limit).',
    });
  }

  current.count++;
  return next();
};

app.use('/api', apiRateLimiter);

// Initialize Supabase Client for server-side operations (e.g. inquiries table persistence)
let supabase: any = null;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey) {
  import('@supabase/supabase-js')
    .then(({ createClient }) => {
      supabase = createClient(supabaseUrl, supabaseKey);
      console.log('[Supabase] Initialized server-side client for inquiries.');
    })
    .catch((err) => {
      console.warn('[Supabase] Failed to initialize client:', err.message);
    });
}

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
    res.setHeader('X-Fallback', 'true');
    return res.json({
      fallback: true,
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
    return res.json({ reply: replyText, fallback: false });
  } catch (err: any) {
    console.warn('Gemini API Error (fallback served):', err?.message || err);
    res.setHeader('X-Fallback', 'true');
    return res.json({
      fallback: true,
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

// Inquiries endpoint supporting honeypot + Supabase insertion with honest error handling
app.post('/api/inquiries', async (req, res) => {
  const { name, email, message, service, budget, timeline, honeypot } = req.body || {};

  // Honeypot bot trap - silently acknowledge bots without database pollution
  if (honeypot) {
    return res.json({ ok: true, trap: true });
  }

  // Strict validation
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ ok: false, error: 'Name is required.' });
  }
  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ ok: false, error: 'Email address is required.' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
  }
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ ok: false, error: 'Message cannot be empty.' });
  }

  // If Supabase is configured with service role or anon key, insert into inquiries table
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .insert([
          {
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
            service: service?.trim() || null,
            budget: budget?.trim() || null,
            timeline: timeline?.trim() || null,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        console.error('Supabase inquiries insert error:', error);
        return res.status(502).json({
          ok: false,
          error: `Failed to record inquiry in Supabase: ${error.message}`,
        });
      }

      return res.json({
        ok: true,
        id: data?.[0]?.id || `inq-${Date.now()}`,
        message: 'Inquiry saved successfully to database.',
      });
    } catch (err: any) {
      console.error('Supabase inquiries unexpected error:', err);
      return res.status(502).json({
        ok: false,
        error: `Supabase database error: ${err?.message || 'Unknown database error'}`,
      });
    }
  }

  // If Supabase credentials are not yet configured on this environment
  console.warn('Inquiry submitted, but SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not configured on server.');
  return res.status(503).json({
    ok: false,
    error: 'Database service is currently unconfigured. Please configure SUPABASE_SERVICE_ROLE_KEY in your server environment or reach out directly at babajani543210@gmail.com.',
  });
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
