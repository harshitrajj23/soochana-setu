-- 1. Create citizen_profiles table for login and linkage
CREATE TABLE citizen_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_number TEXT UNIQUE NOT NULL,
  unified_profile_id UUID REFERENCES unified_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create schemes table for eligibility metadata
CREATE TABLE schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  income_limit NUMERIC,
  monthly_benefit NUMERIC DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Seed some initial schemes for the Citizen Portal
INSERT INTO schemes (name, income_limit, monthly_benefit, description) VALUES
('Housing Subsidy', 300000, 2500, 'Financial assistance for home construction and repair.'),
('Food Security (Ration)', 150000, 1200, 'Subsidized food grains for eligible families.'),
('Old Age Pension', 200000, 1500, 'Monthly financial support for citizens over 60.'),
('MNREGA Job Guarantee', 500000, 3000, 'Guaranteed 100 days of manual work per year.'),
('Student Scholarship', 250000, 800, 'Financial aid for higher education students.');

-- 4. Add index for citizen lookup
CREATE INDEX idx_citizen_id_number ON citizen_profiles(id_number);
