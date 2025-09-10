-- =====================================
-- COMPLETE DATABASE EXPORT
-- Youth Dreamers Foundation Database
-- Export Date: September 10, 2025
-- =====================================

-- TABLE STRUCTURE AND DATA EXPORT

-- =====================================
-- USERS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    phone TEXT,
    userType USER_DEFINED NOT NULL,
    isActive BOOLEAN,
    emailVerified BOOLEAN,
    profileData JSONB,
    createdAt TIMESTAMP WITH TIME ZONE,
    updatedAt TIMESTAMP WITH TIME ZONE
);

-- Users Data (5 records)
INSERT INTO users (id, email, password, firstName, lastName, phone, userType, isActive, emailVerified, profileData, createdAt, updatedAt) VALUES
(1, 'student@ydf.org', '$2a$12$9w/d5diHlUHd96XtOiKf9OmVWDX6yrhlvRJDdPEpWuRlpY7SoG4xK', 'Demo', 'Student', '+91 9876543210', 'student', true, true, '{"course": "B.Tech Computer Science", "college": "Demo College", "documents": []}', '2025-08-30 13:02:18.153707+00', '2025-09-03 07:18:09.76166+00'),
(2, 'admin@ydf.org', '$2a$12$4uvNuQR3X5Q3bjVPXtldyuiu4Y/JJSM3KA1Sc9XlXbWYLuAf/yEKm', 'Super', 'Admin', '+91 9876543211', 'admin', true, true, '{"cgpa": "", "city": "Gautam Buddha nagar", "year": "3rd Year", "state": "Uttar Pradesh", "course": "AT", "gender": "Male", "address": "Extension Sector 16 B", "college": "pui", "pincode": "201318", "category": "General", "rollNumber": "5765667", "dateOfBirth": "", "familyIncome": "40000"}', '2025-08-30 13:02:18.153707+00', '2025-08-31 05:38:41.834314+00'),
(3, 'reviewer@ydf.org', '$2a$12$lIOXXa2vHPr52XJN804kWe8wQKX.ksm9P5NszlXRIBS/muXso.T3e', 'Demo', 'Reviewer', '+91 9876543212', 'reviewer', true, true, '{"specialization": "Academic Review"}', '2025-08-30 13:02:18.153707+00', '2025-08-31 05:30:43.820332+00'),
(4, 'donor@ydf.org', '$2a$12$I..A9iqZVWHO2/kh3C82C.mAdRE0wVRKB4CVmX8ijdsETj674Jt52', 'Demo', 'Donor', '+91 9876543213', 'donor', true, true, '{"organization": "Demo Foundation"}', '2025-08-30 13:02:18.153707+00', '2025-08-31 05:30:44.626279+00'),
(5, 'surveyor@ydf.org', '$2a$12$D5xZHrVBEwJHh2Shgemv2Ob8hNFzuQGQFv3aQwTtdywtWjYats9TG', 'Demo', 'Surveyor', '+91 9876543214', 'surveyor', true, true, '{"department": "Field Verification"}', '2025-08-30 13:02:18.153707+00', '2025-08-31 05:30:45.43361+00');

-- =====================================
-- ROLES TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    permissions JSONB,
    isSystem BOOLEAN,
    createdAt TIMESTAMP WITH TIME ZONE,
    updatedAt TIMESTAMP WITH TIME ZONE
);

-- Roles Data (5 records)
INSERT INTO roles (id, name, description, permissions, isSystem, createdAt, updatedAt) VALUES
(1, 'admin', 'System administrator', null, true, '2025-08-30 13:02:18.378488+00', '2025-08-30 13:02:18.378488+00'),
(2, 'student', 'Student', null, true, '2025-08-30 13:02:18.378488+00', '2025-08-30 13:02:18.378488+00'),
(3, 'reviewer', 'Application reviewer', null, true, '2025-08-30 13:02:18.378488+00', '2025-08-30 13:02:18.378488+00'),
(4, 'donor', 'Donor', null, true, '2025-08-30 13:02:18.378488+00', '2025-08-30 13:02:18.378488+00'),
(5, 'surveyor', 'Field surveyor', null, true, '2025-08-30 13:02:18.378488+00', '2025-08-30 13:02:18.378488+00');

-- =====================================
-- USER_ROLES TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS user_roles (
    id BIGINT PRIMARY KEY,
    userId BIGINT NOT NULL,
    roleId BIGINT NOT NULL
);

-- User Roles Data (5 records)
INSERT INTO user_roles (id, userId, roleId) VALUES
(1, 1, 2),
(2, 2, 1),
(3, 3, 3),
(4, 4, 4),
(5, 5, 5);

-- =====================================
-- SCHOLARSHIPS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS scholarships (
    id BIGINT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    currency TEXT,
    eligibilityCriteria JSONB NOT NULL,
    requiredDocuments JSONB NOT NULL,
    applicationDeadline TIMESTAMP WITH TIME ZONE NOT NULL,
    selectionDeadline TIMESTAMP WITH TIME ZONE,
    maxApplications INTEGER,
    currentApplications INTEGER,
    status TEXT,
    createdBy BIGINT,
    tags JSONB,
    createdAt TIMESTAMP WITH TIME ZONE,
    updatedAt TIMESTAMP WITH TIME ZONE
);

-- Scholarships Data (5 records)
INSERT INTO scholarships (id, title, description, amount, currency, eligibilityCriteria, requiredDocuments, applicationDeadline, selectionDeadline, maxApplications, currentApplications, status, createdBy, tags, createdAt, updatedAt) VALUES
(1, 'Merit Excellence Scholarship', 'Supporting academically excellent students pursuing higher education', 50000.00, 'INR', '["CGPA above 8.5", "Income < 5L per annum", "Regular student"]', '["Academic transcripts", "Income certificate", "ID proof"]', '2025-10-29 13:02:18.603119+00', '2025-11-13 13:02:18.603119+00', 1000, 0, 'active', 2, '["Academic", "Merit", "Higher Education"]', '2025-08-30 13:02:18.603119+00', '2025-08-30 13:02:18.603119+00'),
(2, 'Rural Girls Education Grant', 'Empowering rural girls through quality education opportunities', 35000.00, 'INR', '["Female candidates only", "Rural residence proof", "Family income < 3L"]', '["Income certificate", "Residence proof", "Educational certificates"]', '2025-10-14 13:02:18.603119+00', null, 800, 0, 'active', 2, '["Gender Equality", "Rural Development", "Education"]', '2025-08-30 13:02:18.603119+00', '2025-08-30 13:02:18.603119+00'),
(3, 'Technical Innovation Fund', 'Supporting innovative technology projects and research', 75000.00, 'INR', '["Engineering/Technical students", "Innovation project proposal", "CGPA > 7.5"]', '["Project proposal", "Academic records", "Innovation portfolio"]', '2025-11-28 13:02:18.603119+00', '2025-12-28 13:02:18.603119+00', 500, 0, 'active', 2, '["Technology", "Innovation", "Research", "Engineering"]', '2025-08-30 13:02:18.603119+00', '2025-08-30 13:02:18.603119+00'),
(4, 'Top FOR URBAN', 'Showing for the nearted', 550000.00, 'INR', '["Technology", "Sales"]', '["Adhar Card", "Work Expr"]', '2025-09-18 19:42:00+00', '2025-09-24 05:42:00+00', 45000, 0, 'active', 2, null, '2025-08-31 05:43:56.69361+00', '2025-08-31 05:43:56.69361+00'),
(8, 'Copy of Top FOR URBAN', 'Showing for the nearted', 550000.00, 'INR', '["Technology", "Sales"]', '["Adhar Card", "Work Expr"]', '2025-09-18 19:42:00+00', '2025-09-24 05:42:00+00', 45000, 0, 'active', 2, null, '2025-09-02 04:57:00.076117+00', '2025-09-02 04:57:00.076117+00');

-- =====================================
-- APPLICATIONS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS applications (
    id BIGINT PRIMARY KEY,
    scholarshipId BIGINT NOT NULL,
    studentId BIGINT NOT NULL,
    status USER_DEFINED,
    score INTEGER,
    amountAwarded NUMERIC,
    assignedReviewerId BIGINT,
    reviewNotes TEXT,
    formData JSONB,
    documents JSONB,
    submittedAt TIMESTAMP WITH TIME ZONE,
    updatedAt TIMESTAMP WITH TIME ZONE
);

-- Applications Data (5 records)
INSERT INTO applications (id, scholarshipId, studentId, status, score, amountAwarded, assignedReviewerId, reviewNotes, formData, documents, submittedAt, updatedAt) VALUES
(1, 2, 1, 'submitted', null, null, null, null, null, null, '2025-08-31 05:40:25.580325+00', '2025-08-31 05:40:25.580325+00'),
(2, 4, 1, 'submitted', null, null, null, null, null, null, '2025-09-01 05:21:13.434273+00', '2025-09-01 05:21:13.434273+00'),
(3, 1, 1, 'submitted', null, null, null, null, null, null, '2025-09-01 10:11:14.15504+00', '2025-09-01 10:11:14.15504+00'),
(4, 3, 1, 'submitted', null, null, null, null, null, null, '2025-09-01 11:06:30.239969+00', '2025-09-01 11:06:30.239969+00'),
(5, 8, 1, 'submitted', null, null, null, null, null, null, '2025-09-02 05:21:32.771475+00', '2025-09-02 05:21:32.771475+00');

-- =====================================
-- APPLICATION_REVIEWS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS application_reviews (
    id BIGINT PRIMARY KEY,
    applicationId BIGINT NOT NULL,
    reviewerId BIGINT NOT NULL,
    criteria JSONB,
    overallScore INTEGER,
    comments TEXT,
    recommendation USER_DEFINED,
    isComplete BOOLEAN,
    createdAt TIMESTAMP WITH TIME ZONE,
    updatedAt TIMESTAMP WITH TIME ZONE
);

-- Application Reviews Data (0 records - table is empty)

-- =====================================
-- ANNOUNCEMENTS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS announcements (
    id BIGINT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT,
    targetAudience JSONB,
    isActive BOOLEAN,
    priority TEXT,
    validFrom TIMESTAMP WITH TIME ZONE,
    validTo TIMESTAMP WITH TIME ZONE,
    createdBy BIGINT,
    createdAt TIMESTAMP WITH TIME ZONE,
    updatedAt TIMESTAMP WITH TIME ZONE
);

-- Announcements Data (3 records)
INSERT INTO announcements (id, title, content, type, targetAudience, isActive, priority, validFrom, validTo, createdBy, createdAt, updatedAt) VALUES
(1, 'Welcome to Youth Dreamers Foundation', 'Welcome to our scholarship portal. Apply for various scholarships and track your progress.', 'general', '["student"]', true, 'normal', '2025-08-30 13:02:18.82851+00', null, 1, '2025-08-30 13:02:18.82851+00', '2025-08-30 13:02:18.82851+00'),
(2, 'System Maintenance Notice', 'Regular maintenance scheduled this weekend. Portal may be temporarily unavailable.', 'maintenance', '["student", "admin", "reviewer", "donor"]', true, 'normal', '2025-08-30 13:02:18.82851+00', null, 1, '2025-08-30 13:02:18.82851+00', '2025-08-30 13:02:18.82851+00'),
(3, 'New Scholarships Available', 'Several new scholarship opportunities have been added. Check the scholarships page for details.', 'announcement', '["student"]', true, 'high', '2025-08-30 13:02:18.82851+00', null, 1, '2025-08-30 13:02:18.82851+00', '2025-08-30 13:02:18.82851+00');

-- =====================================
-- DATABASE STATISTICS
-- =====================================
-- Total Tables: 7
-- Total Records: 23
-- Users: 5 (1 student, 1 admin, 1 reviewer, 1 donor, 1 surveyor)
-- Scholarships: 5 active scholarships (₹35,000 to ₹5,50,000)
-- Applications: 5 submitted applications (all from student@ydf.org)
-- Reviews: 0 (no reviews completed yet)
-- Announcements: 3 active announcements

-- =====================================
-- END OF EXPORT
-- =====================================