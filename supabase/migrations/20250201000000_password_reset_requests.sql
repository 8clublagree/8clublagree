-- Create password_reset_requests table if it doesn't exist (full schema)
CREATE TABLE IF NOT EXISTS password_reset_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  requested_at timestamptz NOT NULL DEFAULT now(),
  otp varchar(6) NOT NULL DEFAULT '',
  reset_token uuid,
  used_at timestamptz
);

-- Add missing columns if table already existed with older schema
ALTER TABLE password_reset_requests ADD COLUMN IF NOT EXISTS otp varchar(6) NOT NULL DEFAULT '';
ALTER TABLE password_reset_requests ADD COLUMN IF NOT EXISTS reset_token uuid;
ALTER TABLE password_reset_requests ADD COLUMN IF NOT EXISTS used_at timestamptz;

-- Indexes for lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_requests_email_requested
  ON password_reset_requests(email, requested_at DESC);

CREATE INDEX IF NOT EXISTS idx_password_reset_requests_reset_token
  ON password_reset_requests(reset_token) WHERE reset_token IS NOT NULL;

-- RLS (service_role bypasses; anon has no access)
ALTER TABLE password_reset_requests ENABLE ROW LEVEL SECURITY;
