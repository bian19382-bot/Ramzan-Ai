// Cloudflare Pages Function: POST /api/inquiries
// Handles inquiry submissions on Cloudflare edge.

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

interface Env {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SUPABASE_ANON_KEY?: string;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const data = (await context.request.json().catch(() => null)) as {
      name?: string;
      email?: string;
      message?: string;
      service?: string;
      budget?: string;
      timeline?: string;
      honeypot?: string;
    } | null;

    if (data?.honeypot) {
      // Spam honeypot trap triggered - silently return success
      return new Response(JSON.stringify({ ok: true, trap: true }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (!data?.name || !data?.email || !data?.message) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Name, email, and message are required.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Please enter a valid email address.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const supabaseUrl = context.env.SUPABASE_URL;
    const supabaseKey = context.env.SUPABASE_SERVICE_ROLE_KEY || context.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const restUrl = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/inquiries`;
      const res = await fetch(restUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
          message: data.message.trim(),
          service: data.service?.trim() || null,
          budget: data.budget?.trim() || null,
          timeline: data.timeline?.trim() || null,
          created_at: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return new Response(
          JSON.stringify({ ok: false, error: `Supabase insert failed: ${errorText}` }),
          { status: 502, headers: corsHeaders }
        );
      }

      const rows = (await res.json().catch(() => [])) as any[];
      return new Response(
        JSON.stringify({ ok: true, id: rows?.[0]?.id || `inq-${Date.now()}` }),
        { status: 200, headers: corsHeaders }
      );
    }

    // Honest 503 if Supabase server-side credentials are not set on Cloudflare
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'Inquiries database service is unconfigured. Please email babajani543210@gmail.com directly.',
      }),
      { status: 503, headers: corsHeaders }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, error: err?.message || 'Failed to process inquiry.' }),
      { status: 500, headers: corsHeaders }
    );
  }
};
