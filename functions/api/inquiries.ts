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

export const onRequestPost = async ({ request }: { request: Request }) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const data = (await request.json().catch(() => null)) as {
      name?: string;
      email?: string;
      message?: string;
      honeypot?: string;
    } | null;

    if (data?.honeypot) {
      // Spam honeypot trap triggered - silently return success
      return new Response(JSON.stringify({ ok: true }), {
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

    return new Response(
      JSON.stringify({ ok: true, id: `inq-${Date.now()}` }),
      { status: 200, headers: corsHeaders }
    );
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: 'Failed to process inquiry.' }),
      { status: 500, headers: corsHeaders }
    );
  }
};
