-- Supabase Inquiries Schema & Row-Level Security (RLS) Policy
-- Run this in your Supabase SQL Editor if the 'inquiries' table does not exist yet.
-- Rule: Never execute directly from automated agents without explicit approval.

CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    service TEXT,
    budget TEXT,
    timeline TEXT,
    status TEXT DEFAULT 'new' NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Security Rule: No public read or write access.
-- Only the backend server using the SUPABASE_SERVICE_ROLE_KEY can insert or read inquiries.
-- Authenticated admins can view inquiries if authorized:
CREATE POLICY "Admins can view all inquiries"
    ON public.inquiries
    FOR SELECT
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'babajani543210@gmail.com');

-- Comment explaining the RLS policy:
COMMENT ON TABLE public.inquiries IS 'Stores client contact submissions securely. Public anonymous access is strictly denied; backend server writes via service-role key.';
