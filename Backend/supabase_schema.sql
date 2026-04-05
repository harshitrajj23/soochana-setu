-- Create beneficiaries table
CREATE TABLE beneficiaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  address TEXT,
  id_number TEXT,
  income NUMERIC,
  scheme_name TEXT,
  raw_data JSONB,
  normalized_data JSONB,
  unified_profile_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unified_profiles table
CREATE TABLE unified_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  address TEXT,
  confidence_score NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Associate beneficiaries with unified_profiles (Many-to-One)
ALTER TABLE beneficiaries 
ADD CONSTRAINT fk_unified_profile 
FOREIGN KEY (unified_profile_id) 
REFERENCES unified_profiles(id) 
ON DELETE SET NULL;

-- Create uploads table
CREATE TABLE uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add some indexes for performance
CREATE INDEX idx_beneficiary_id_number ON beneficiaries(id_number);
CREATE INDEX idx_beneficiary_address ON beneficiaries(address);
CREATE INDEX idx_beneficiary_scheme_name ON beneficiaries(scheme_name);
