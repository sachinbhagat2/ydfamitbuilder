
-- Youth Dreamers Foundation PostgreSQL Schema
-- Converted from MySQL dump for sparsind_ydf_ngo database

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'general',
  "targetAudience" JSONB DEFAULT NULL,
  "isActive" BOOLEAN DEFAULT TRUE,
  priority VARCHAR(10) DEFAULT 'normal',
  "validFrom" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "validTo" TIMESTAMPTZ DEFAULT NULL,
  "createdBy" BIGINT DEFAULT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id BIGSERIAL PRIMARY KEY,
  "scholarshipId" BIGINT NOT NULL,
  "studentId" BIGINT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'submitted',
  score INTEGER DEFAULT NULL,
  "amountAwarded" DECIMAL(10,2) DEFAULT NULL,
  "assignedReviewerId" BIGINT DEFAULT NULL,
  "reviewNotes" TEXT,
  "formData" JSONB DEFAULT NULL,
  documents JSONB DEFAULT NULL,
  "submittedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (status IN ('draft','submitted','under_review','approved','rejected'))
);

-- Create scholarships table  
CREATE TABLE IF NOT EXISTS scholarships (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  "eligibilityCriteria" JSONB NOT NULL,
  "requiredDocuments" JSONB NOT NULL,
  "applicationDeadline" TIMESTAMPTZ NOT NULL,
  "selectionDeadline" TIMESTAMPTZ NULL,
  "maxApplications" INTEGER NULL,
  "currentApplications" INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  "createdBy" BIGINT NULL,
  tags JSONB NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create users table with proper enum type
DO $$ BEGIN
  CREATE TYPE user_type AS ENUM ('student','admin','reviewer','donor','surveyor');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  "firstName" VARCHAR(100) NOT NULL,
  "lastName" VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  "userType" user_type NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
  "profileData" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB,
  "isSystem" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id BIGSERIAL PRIMARY KEY,
  "userId" BIGINT NOT NULL,
  "roleId" BIGINT NOT NULL,
  UNIQUE("userId","roleId")
);

-- Create application_reviews table
CREATE TABLE IF NOT EXISTS application_reviews (
  id BIGSERIAL PRIMARY KEY,
  "applicationId" BIGINT NOT NULL,
  "reviewerId" BIGINT NOT NULL,
  criteria JSONB,
  "overallScore" INTEGER,
  comments TEXT,
  recommendation VARCHAR(30),
  "isComplete" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, description, "isSystem") VALUES
('admin', 'System administrator', TRUE),
('student', 'Student', TRUE),
('reviewer', 'Application reviewer', TRUE),
('donor', 'Donor', TRUE),
('surveyor', 'Field surveyor', TRUE)
ON CONFLICT (name) DO NOTHING;

-- Insert default users with bcrypt hashed passwords
-- All passwords are: Student123!, Admin123!, Reviewer123!, Donor123!, Surveyor123!
INSERT INTO users (email, password, "firstName", "lastName", phone, "userType", "isActive", "emailVerified", "profileData") VALUES
('student@ydf.org', '$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS', 'Demo', 'Student', '+91 9876543210', 'student', TRUE, TRUE, '{"course": "B.Tech Computer Science", "college": "Demo College", "year": "3rd Year", "cgpa": "8.75"}'),
('admin@ydf.org', '$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS', 'Demo', 'Admin', '+91 9876543211', 'admin', TRUE, TRUE, '{"department": "Administration", "role": "System Administrator"}'),
('reviewer@ydf.org', '$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS', 'Demo', 'Reviewer', '+91 9876543212', 'reviewer', TRUE, TRUE, '{"specialization": "Academic Review", "experience": "5 years"}'),
('donor@ydf.org', '$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS', 'Demo', 'Donor', '+91 9876543213', 'donor', TRUE, TRUE, '{"organization": "Demo Foundation", "type": "Individual"}'),
('surveyor@ydf.org', '$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS', 'Demo', 'Surveyor', '+91 9876543214', 'surveyor', TRUE, TRUE, '{"department": "Field Verification"}')
ON CONFLICT (email) DO NOTHING;

-- Assign roles to users
INSERT INTO user_roles ("userId", "roleId") 
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'admin@ydf.org' AND r.name = 'admin'
ON CONFLICT ("userId", "roleId") DO NOTHING;

INSERT INTO user_roles ("userId", "roleId") 
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'student@ydf.org' AND r.name = 'student'
ON CONFLICT ("userId", "roleId") DO NOTHING;

INSERT INTO user_roles ("userId", "roleId") 
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'reviewer@ydf.org' AND r.name = 'reviewer'
ON CONFLICT ("userId", "roleId") DO NOTHING;

INSERT INTO user_roles ("userId", "roleId") 
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'donor@ydf.org' AND r.name = 'donor'
ON CONFLICT ("userId", "roleId") DO NOTHING;

INSERT INTO user_roles ("userId", "roleId") 
SELECT u.id, r.id FROM users u, roles r WHERE u.email = 'surveyor@ydf.org' AND r.name = 'surveyor'
ON CONFLICT ("userId", "roleId") DO NOTHING;

-- Insert sample scholarships
INSERT INTO scholarships (title, description, amount, "eligibilityCriteria", "requiredDocuments", "applicationDeadline", status, tags) VALUES
('Merit Excellence Scholarship', 'Supporting academically excellent students', 50000.00, '["CGPA above 8.5", "Income < 5L"]', '["Transcripts", "Income certificate"]', NOW() + INTERVAL '60 days', 'active', '["Academic", "Merit"]'),
('Rural Girls Education Grant', 'Empowering rural girls through education', 35000.00, '["Female candidates", "Rural residence"]', '["Income certificate", "Residence proof"]', NOW() + INTERVAL '45 days', 'active', '["Gender", "Rural"]'),
('Technical Innovation Fund', 'Funding innovative tech projects', 75000.00, '["Engineering students", "Project proposal"]', '["Proposal", "Transcripts"]', NOW() + INTERVAL '90 days', 'active', '["Technology", "Innovation"]'),
('Arts & Culture Scholarship', 'Preserving arts and culture', 30000.00, '["Arts students", "Portfolio"]', '["Portfolio", "Income certificate"]', NOW() + INTERVAL '25 days', 'active', '["Arts", "Culture"]')
ON CONFLICT DO NOTHING;

-- Insert sample announcements
INSERT INTO announcements (title, content, type, "targetAudience", "isActive", priority, "createdBy") VALUES
('Application Deadline Extended', 'The deadline for the Merit Excellence Scholarship has been extended by one week.', 'deadline', '["student"]', TRUE, 'high', 2),
('Maintenance Notice', 'Scheduled maintenance on Sunday 10 PM - 12 AM. Portal access may be intermittent.', 'maintenance', '["student", "reviewer", "admin", "donor"]', TRUE, 'normal', 2),
('Results Published', 'Results for the first round of the Technical Innovation Fund have been published.', 'result', '["student"]', TRUE, 'urgent', 2)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_type ON users("userType");
CREATE INDEX IF NOT EXISTS idx_applications_student ON applications("studentId");
CREATE INDEX IF NOT EXISTS idx_applications_scholarship ON applications("scholarshipId");
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_scholarships_status ON scholarships(status);
CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements("isActive");

COMMIT;
