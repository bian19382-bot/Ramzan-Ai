import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

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

// Server-side AI Consultation endpoint with Gemini 4 High Thinking
app.post('/api/ai/consult', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Missing query in request body' });
    }

    if (!ai) {
      return res.json({
        reply:
          `### Architectural Scoping (Demo Fallback)\n\n` +
          `1. **System Core:** React 19 + TypeScript frontend backed by a high-throughput Express REST & WebSocket service.\n` +
          `2. **State & Telemetry:** Optimized client-side reactive store with sub-100ms response targets.\n` +
          `3. **Key Recommendation for: "${query.slice(0, 80)}"**\n` +
          `- Decouple state machines from visual rendering.\n` +
          `- Enforce WCAG 2.2 AA accessibility and test-driven reliability.\n` +
          `- Configure edge caching to guarantee sub-2.5s LCP on throttled 4G connections.`,
      });
    }

    const systemInstruction =
      'You are the technical AI architect and senior engineering lead behind this personal portfolio. ' +
      'A potential client, hiring manager, or technical recruiter is asking you for an architectural assessment, ' +
      'timeline estimation, or technology recommendation. Provide a rigorous, structured, and realistic breakdown ' +
      'with recommended tech stack, edge cases, performance budgets, and milestones. Use concise formatting with headings and bullet points.';

    // Execute with gemini-4-argon, thinkingLevel: HIGH, and no maxOutputTokens
    const response = await ai.models.generateContent({
      model: 'gemini-4-argon',
      contents: query,
      config: {
        systemInstruction,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
    });

    const replyText = response.text || 'Unable to generate architectural response.';
    return res.json({ reply: replyText });
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    // Provide a graceful fallback response if model API fails or key is missing
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
