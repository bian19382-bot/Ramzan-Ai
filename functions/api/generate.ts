// Cloudflare Pages Function: POST /api/generate
// Official Google Gemini API integration running at the edge with server-side secrets.

interface Env {
  GEMINI_API_KEY?: string;
}

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const contentType = context.request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ error: 'Invalid content type. Expected application/json.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const body = (await context.request.json().catch(() => null)) as { query?: string; prompt?: string } | null;
    const rawQuery = body?.query || body?.prompt;

    // Strict input validation
    if (!rawQuery || typeof rawQuery !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid "query" or "prompt" field.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const query = rawQuery.trim();
    if (query.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Query cannot be empty.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (query.length > 2500) {
      return new Response(
        JSON.stringify({ error: 'Query exceeds maximum allowed length of 2500 characters.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const apiKey = context.env.GEMINI_API_KEY;

    // If API key is not configured in Cloudflare environment bindings, provide high-quality fallback
    if (!apiKey || apiKey.trim() === '' || apiKey.includes('MY_GEMINI_API_KEY')) {
      return new Response(
        JSON.stringify({
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
        }),
        { status: 200, headers: { ...corsHeaders, 'X-Fallback': 'true' } }
      );
    }

    // Call official Gemini API with 15-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const systemPrompt =
      'You are the technical AI architect and senior engineering lead for Ramzan\'s digital portfolio. ' +
      'A potential client, hiring manager, or technical collaborator is asking for an architectural breakdown, ' +
      'technology recommendation, or project scoping. Provide a concise, highly structured, professional assessment ' +
      'with recommended stack, risk mitigations, and delivery milestones using clean markdown headings and bullet points.';

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${systemPrompt}\n\nClient Query: ${query}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      }),
    });

    clearTimeout(timeoutId);

    if (!geminiRes.ok) {
      console.warn(`Gemini API returned status ${geminiRes.status}`);
      // Return structured fallback rather than crashing client UI
      return new Response(
        JSON.stringify({
          fallback: true,
          reply:
            `### Architectural Consultation Assessment\n\n` +
            `**1. Architecture Breakdown:**\n` +
            `- **Presentation:** React 19 SPA with code-split bundles and responsive grid.\n` +
            `- **Edge Layer:** Cloudflare Pages Functions providing sub-50ms TTFB worldwide.\n` +
            `- **Security:** Strict Content Security Policy, zero exposed API credentials, and sanitized user inputs.\n\n` +
            `**2. Next Steps:**\n` +
            `- Contact directly via babajani543210@gmail.com or WhatsApp to schedule a detailed discovery discussion.`,
        }),
        { status: 200, headers: { ...corsHeaders, 'X-Fallback': 'true' } }
      );
    }

    const geminiData = (await geminiRes.json()) as any;
    const text =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No response generated by the model.';

    return new Response(JSON.stringify({ reply: text }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err: any) {
    const isTimeout = err?.name === 'AbortError';
    return new Response(
      JSON.stringify({
        reply: isTimeout
          ? 'The AI analysis timed out. Please try again with a more concise request.'
          : 'Unable to complete AI consultation at this moment. Please reach out directly via contact form.',
      }),
      { status: 200, headers: corsHeaders }
    );
  }
};
