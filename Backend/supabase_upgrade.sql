-- 1. Upgrade unified_profiles to support verification and hashing
ALTER TABLE unified_profiles 
ADD COLUMN verification_status TEXT DEFAULT 'pending',
ADD COLUMN record_hash TEXT;

-- 2. Create audit_logs table for blockchain-ready traceability
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES unified_profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Add index for faster log lookups
CREATE INDEX idx_audit_profile_id ON audit_logs(profile_id);
CREATE INDEX idx_audit_event_type ON audit_logs(event_type);
