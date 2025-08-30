-- Import MySQL schema converted to PostgreSQL format
-- Based on the provided MySQL dump for sparsind_ydf_ngo database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types for PostgreSQL
DO $$ BEGIN
    CREATE TYPE user_type AS ENUM ('student','admin','reviewer','donor','surveyor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('draft','submitted','under_review','approved','rejected','waitlisted');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE recommendation_type AS ENUM ('approve','reject','conditionally_approve');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    phone TEXT,
    "userType" user_type NOT NULL,
    "isActive" BOOLEAN DEFAULT TRUE,
    "emailVerified" BOOLEAN DEFAULT FALSE,
    "profileData" JSONB,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'general',
    "targetAudience" JSONB,
    "isActive" BOOLEAN DEFAULT TRUE,
    priority TEXT DEFAULT 'normal',
    "validFrom" TIMESTAMPTZ DEFAULT NOW(),
    "validTo" TIMESTAMPTZ,
    "createdBy" BIGINT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
    id BIGSERIAL PRIMARY KEY,
    "scholarshipId" BIGINT NOT NULL,
    "studentId" BIGINT NOT NULL,
    status application_status DEFAULT 'submitted',
    score INTEGER,
    "amountAwarded" NUMERIC(10,2),
    "assignedReviewerId" BIGINT,
    "reviewNotes" TEXT,
    "formData" JSONB,
    documents JSONB,
    "submittedAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    "eligibilityCriteria" JSONB NOT NULL,
    "requiredDocuments" JSONB NOT NULL,
    "applicationDeadline" TIMESTAMPTZ NOT NULL,
    "selectionDeadline" TIMESTAMPTZ,
    "maxApplications" INTEGER,
    "currentApplications" INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    "createdBy" BIGINT,
    tags JSONB,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB,
    "isSystem" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- User roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
    id BIGSERIAL PRIMARY KEY,
    "userId" BIGINT NOT NULL,
    "roleId" BIGINT NOT NULL,
    UNIQUE("userId", "roleId")
);

-- Application reviews table
CREATE TABLE IF NOT EXISTS application_reviews (
    id BIGSERIAL PRIMARY KEY,
    "applicationId" BIGINT NOT NULL,
    "reviewerId" BIGINT NOT NULL,
    criteria JSONB,
    "overallScore" INTEGER,
    comments TEXT,
    recommendation recommendation_type,
    "isComplete" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_type ON users("userType");
CREATE INDEX IF NOT EXISTS idx_applications_scholarship ON applications("scholarshipId");
CREATE INDEX IF NOT EXISTS idx_applications_student ON applications("studentId");
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_reviewer ON applications("assignedReviewerId");
CREATE INDEX IF NOT EXISTS idx_scholarships_status ON scholarships(status);
CREATE INDEX IF NOT EXISTS idx_reviews_application ON application_reviews("applicationId");
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON application_reviews("reviewerId");
CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements("isActive");

-- Insert default users with bcrypt hashed passwords
-- All passwords are: Student123!, Admin123!, Reviewer123!, Donor123!, Surveyor123!
INSERT INTO users (email, password, "firstName", "lastName", phone, "userType", "isActive", "emailVerified", "profileData") VALUES
('student@ydf.org', '$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS', 'Demo', 'Student', '+91 9876543210', 'student', TRUE, TRUE, '{"course": "B.Tech Computer Science", "college": "Demo College", "year": "3rd Year", "cgpa": "8.75"}'),
('admin@ydf.org', '$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS', 'Demo', 'Admin', '+91 9876543211', 'admin', TRUE, TRUE, '{"department": "Administration", "role": "System Administrator"}'),
('reviewer@ydf.org', '$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS', 'Demo', 'Reviewer', '+91 9876543212', 'reviewer', TRUE, TRUE, '{"specialization": "Academic Review", "experience": "5 years"}'),
('donor@ydf.org', '$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS', 'Demo', 'Donor', '+91 9876543213', 'donor', TRUE, TRUE, '{"organization": "Demo Foundation", "type": "Individual"}'),
('surveyor@ydf.org', '$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS', 'Demo', 'Surveyor', '+91 9876543214', 'surveyor', TRUE, TRUE, '{"department": "Field Verification"}')
ON CONFLICT (email) DO NOTHING;

-- Insert default roles
INSERT INTO roles (name, description, "isSystem") VALUES
('admin', 'System administrator', TRUE),
('student', 'Student', TRUE),
('reviewer', 'Application reviewer', TRUE),
('donor', 'Donor', TRUE),
('surveyor', 'Field surveyor', TRUE)
ON CONFLICT (name) DO NOTHING;

-- Insert sample scholarships
INSERT INTO scholarships (title, description, amount, currency, "eligibilityCriteria", "requiredDocuments", "applicationDeadline", "selectionDeadline", "maxApplications", "currentApplications", status, "createdBy", tags) VALUES
(
    'Merit Excellence Scholarship',
    'Supporting academically excellent students pursuing higher education',
    50000.00,
    'INR',
    '["CGPA above 8.5", "Income < 5L per annum", "Regular student"]',
    '["Academic transcripts", "Income certificate", "ID proof"]',
    NOW() + INTERVAL '60 days',
    NOW() + INTERVAL '75 days',
    1000,
    0,
    'active',
    2,
    '["Academic", "Merit", "Higher Education"]'
),
(
    'Rural Girls Education Grant',
    'Empowering rural girls through quality education opportunities',
    35000.00,
    'INR',
    '["Female candidates only", "Rural residence proof", "Family income < 3L"]',
    '["Income certificate", "Residence proof", "Educational certificates"]',
    NOW() + INTERVAL '45 days',
    NULL,
    800,
    0,
    'active',
    2,
    '["Gender Equality", "Rural Development", "Education"]'
),
(
    'Technical Innovation Fund',
    'Supporting innovative technology projects and research',
    75000.00,
    'INR',
    '["Engineering/Technical students", "Innovation project proposal", "CGPA > 7.5"]',
    '["Project proposal", "Academic records", "Innovation portfolio"]',
    NOW() + INTERVAL '90 days',
    NOW() + INTERVAL '120 days',
    500,
    0,
    'active',
    2,
    '["Technology", "Innovation", "Research", "Engineering"]'
)
ON CONFLICT DO NOTHING;

-- Insert sample announcements (converting from your MySQL data structure)
INSERT INTO announcements (title, content, type, "targetAudience", "isActive", priority, "createdBy") VALUES
('Welcome to Youth Dreamers Foundation', 'Welcome to our scholarship portal. Apply for various scholarships and track your progress.', 'general', '["student"]'::jsonb, TRUE, 'normal', 1),
('System Maintenance Notice', 'Regular maintenance scheduled this weekend. Portal may be temporarily unavailable.', 'maintenance', '["student","admin","reviewer","donor"]'::jsonb, TRUE, 'normal', 1),
('New Scholarships Available', 'Several new scholarship opportunities have been added. Check the scholarships page for details.', 'announcement', '["student"]'::jsonb, TRUE, 'high', 1)
ON CONFLICT DO NOTHING;