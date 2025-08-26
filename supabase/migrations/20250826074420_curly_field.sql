-- Youth Dreamers Foundation MySQL Database Setup
-- Database: sparsind_ydf_ngo
-- Host: sparsindia.com
-- User: sparsind_ydf

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Use the correct database
USE sparsind_ydf_ngo;

-- Create users table
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  user_type VARCHAR(20) NOT NULL COMMENT 'student, admin, reviewer, donor',
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  profile_data JSON,
  INDEX idx_email (email),
  INDEX idx_user_type (user_type),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create scholarships table
DROP TABLE IF EXISTS scholarships;
CREATE TABLE scholarships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  eligibility_criteria JSON NOT NULL,
  required_documents JSON NOT NULL,
  application_deadline TIMESTAMP NOT NULL,
  selection_deadline TIMESTAMP NULL,
  max_applications INT NULL,
  current_applications INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' COMMENT 'active, inactive, closed',
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  tags JSON,
  INDEX idx_status (status),
  INDEX idx_deadline (application_deadline),
  INDEX idx_created_by (created_by),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create applications table
DROP TABLE IF EXISTS applications;
CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  scholarship_id INT NOT NULL,
  status VARCHAR(20) DEFAULT 'submitted' COMMENT 'submitted, under_review, approved, rejected, waitlisted',
  application_data JSON NOT NULL,
  documents JSON,
  score DECIMAL(5,2) NULL,
  review_notes TEXT,
  reviewed_by INT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_student (student_id),
  INDEX idx_scholarship (scholarship_id),
  INDEX idx_status (status),
  INDEX idx_reviewed_by (reviewed_by),
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create reviews table
DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  reviewer_id INT NOT NULL,
  criteria JSON NOT NULL,
  overall_score DECIMAL(5,2) NOT NULL,
  comments TEXT,
  recommendation VARCHAR(30) COMMENT 'approve, reject, conditionally_approve',
  is_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_application (application_id),
  INDEX idx_reviewer (reviewer_id),
  INDEX idx_complete (is_complete),
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create notifications table
DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) NOT NULL COMMENT 'application, deadline, announcement, message',
  is_read BOOLEAN DEFAULT FALSE,
  related_id INT NULL,
  related_type VARCHAR(50) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_type (type),
  INDEX idx_read (is_read),
  INDEX idx_created (created_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create documents table
DROP TABLE IF EXISTS documents;
CREATE TABLE documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  application_id INT NULL,
  file_name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size INT NOT NULL,
  file_url TEXT NOT NULL,
  document_type VARCHAR(50) NOT NULL COMMENT 'marksheet, certificate, id_proof, etc.',
  is_verified BOOLEAN DEFAULT FALSE,
  verification_notes TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_application (application_id),
  INDEX idx_type (document_type),
  INDEX idx_verified (is_verified),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create announcements table
DROP TABLE IF EXISTS announcements;
CREATE TABLE announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'general' COMMENT 'general, deadline, result, maintenance',
  target_audience JSON,
  is_active BOOLEAN DEFAULT TRUE,
  priority VARCHAR(10) DEFAULT 'normal' COMMENT 'low, normal, high, urgent',
  valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  valid_to TIMESTAMP NULL,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active (is_active),
  INDEX idx_type (type),
  INDEX idx_priority (priority),
  INDEX idx_valid (valid_from, valid_to),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create contributions table
DROP TABLE IF EXISTS contributions;
CREATE TABLE contributions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  donor_id INT NOT NULL,
  scholarship_id INT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' COMMENT 'pending, completed, failed, refunded',
  contribution_type VARCHAR(20) DEFAULT 'one_time' COMMENT 'one_time, recurring',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  INDEX idx_donor (donor_id),
  INDEX idx_scholarship (scholarship_id),
  INDEX idx_status (status),
  INDEX idx_type (contribution_type),
  FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create settings table
DROP TABLE IF EXISTS settings;
CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSON NOT NULL,
  description TEXT,
  updated_by INT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_key (setting_key),
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Insert default users with bcrypt hashed passwords
-- All passwords are: Student123!, Admin123!, Reviewer123!, Donor123!
-- Hash generated with bcrypt rounds=12
INSERT INTO users (email, password, first_name, last_name, phone, user_type, profile_data, is_active, email_verified) VALUES
('student@ydf.org', '$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS', 'Demo', 'Student', '+91 9876543210', 'student', '{"course": "B.Tech Computer Science", "college": "Demo College", "year": "3rd Year", "cgpa": "8.75"}', TRUE, TRUE),
('admin@ydf.org', '$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS', 'Demo', 'Admin', '+91 9876543211', 'admin', '{"department": "Administration", "role": "System Administrator"}', TRUE, TRUE),
('reviewer@ydf.org', '$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS', 'Demo', 'Reviewer', '+91 9876543212', 'reviewer', '{"specialization": "Academic Review", "experience": "5 years"}', TRUE, TRUE),
('donor@ydf.org', '$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS', 'Demo', 'Donor', '+91 9876543213', 'donor', '{"organization": "Demo Foundation", "type": "Individual"}', TRUE, TRUE);

-- Insert sample scholarship data
INSERT INTO scholarships (title, description, amount, eligibility_criteria, required_documents, application_deadline, status, tags) VALUES
('Merit Excellence Scholarship', 'Supporting academically excellent students with financial assistance to pursue their educational goals.', 50000.00, '["CGPA above 8.5", "Annual family income below ₹5 lakhs", "Currently enrolled in UG/PG program"]', '["Academic transcripts", "Income certificate", "Aadhaar card", "Bank account details"]', '2024-03-15 23:59:59', 'active', '["Academic", "Merit-based", "UG/PG"]'),
('Rural Girls Education Grant', 'Empowering rural girls through education by providing financial support for higher studies.', 35000.00, '["Female candidates only", "From rural areas", "Family income below ₹3 lakhs", "Age between 18-25 years"]', '["Income certificate", "Rural residence proof", "Academic records", "Aadhaar card"]', '2024-04-20 23:59:59', 'active', '["Gender", "Rural", "Empowerment"]'),
('Technical Innovation Fund', 'Supporting innovative technology projects that solve real-world problems.', 75000.00, '["Engineering/Technology students", "Innovative project proposal required", "CGPA above 7.5", "Team project (2-4 members)"]', '["Project proposal", "Technical documentation", "Team details", "Academic transcripts"]', '2024-05-30 23:59:59', 'active', '["Technology", "Innovation", "Team"]'),
('Women Empowerment Scholarship', 'Supporting women in higher education and professional development.', 40000.00, '["Female candidates", "Pursuing higher education", "Family income below ₹4 lakhs", "Academic merit"]', '["Academic records", "Income certificate", "Gender certificate", "Aadhaar card"]', '2024-04-15 23:59:59', 'active', '["Women", "Empowerment", "Higher Education"]'),
('Disability Support Scholarship', 'Supporting students with disabilities to access quality education without financial barriers.', 40000.00, '["Students with disabilities", "Valid disability certificate", "Minimum 60% in previous qualification"]', '["Disability certificate", "Medical reports", "Academic transcripts", "Income certificate"]', '2024-04-15 23:59:59', 'active', '["Disability", "Inclusive", "Support"]'),
('Sports Excellence Scholarship', 'Supporting talented athletes to balance sports and education excellence.', 45000.00, '["Sports achievements at state/national level", "Currently training/competing", "Student-athlete status"]', '["Sports achievement certificates", "Coach recommendation", "Academic records", "Medical fitness certificate"]', '2024-02-28 23:59:59', 'active', '["Sports", "Athletic", "Performance"]');

-- Insert sample announcements
INSERT INTO announcements (title, content, type, target_audience, priority, created_by) VALUES
('Welcome to Youth Dreamers Foundation', 'Welcome to our scholarship platform! Start exploring available opportunities and apply for scholarships that match your profile. Our comprehensive system helps you track applications, connect with mentors, and achieve your educational goals.', 'general', '["student", "admin", "reviewer", "donor"]', 'normal', 2),
('New Scholarship Programs Launched', 'We have launched six new scholarship programs for the academic year 2024-25. Check out the latest opportunities in technology, rural development, academic excellence, women empowerment, disability support, and sports excellence.', 'general', '["student"]', 'high', 2),
('Application Deadline Reminder', 'Reminder: Merit Excellence Scholarship applications close on March 15, 2024. Submit your applications before the deadline. Ensure all required documents are uploaded and verified.', 'deadline', '["student"]', 'high', 2),
('Document Verification Process', 'All uploaded documents will be verified within 3-5 business days. Please ensure documents are clear, legible, and in the correct format (PDF, JPG, PNG). Contact support if you face any issues.', 'general', '["student"]', 'normal', 2),
('System Maintenance Notice', 'Scheduled maintenance on Sunday, February 25, 2024, from 2:00 AM to 4:00 AM IST. The platform will be temporarily unavailable during this time.', 'maintenance', '["student", "admin", "reviewer", "donor"]', 'normal', 2);

-- Insert sample notifications for demo student
INSERT INTO notifications (user_id, title, message, type, related_id, related_type) VALUES
(1, 'Welcome to Youth Dreamers Foundation!', 'Your account has been created successfully. Complete your profile and start exploring scholarship opportunities.', 'general', NULL, NULL),
(1, 'New Scholarship Available', 'A new Merit Excellence Scholarship is now available. Check if you are eligible and apply before the deadline.', 'application', 1, 'scholarship'),
(1, 'Application Deadline Approaching', 'The deadline for Merit Excellence Scholarship is approaching. Submit your application by March 15, 2024.', 'deadline', 1, 'scholarship');

-- Insert application settings
INSERT INTO settings (setting_key, setting_value, description) VALUES
('app_name', '"Youth Dreamers Foundation"', 'Application name'),
('app_version', '"1.0.0"', 'Current application version'),
('max_file_size', '10485760', 'Maximum file upload size in bytes (10MB)'),
('allowed_file_types', '["pdf", "jpg", "jpeg", "png", "doc", "docx"]', 'Allowed file types for document upload'),
('email_verification_required', 'false', 'Whether email verification is required for new users'),
('application_fee', '0', 'Application fee amount (0 = free)'),
('support_email', '"support@youthdreamers.org"', 'Support email address'),
('support_phone', '"+91 80-1234-5678"', 'Support phone number');

-- Create sample application for demo
INSERT INTO applications (student_id, scholarship_id, status, application_data, submitted_at) VALUES
(1, 1, 'under_review', '{"personal_info": {"name": "Demo Student", "age": 20, "gender": "Male"}, "academic_info": {"course": "B.Tech Computer Science", "college": "Demo College", "year": "3rd Year", "cgpa": "8.75"}, "family_info": {"annual_income": "400000", "father_occupation": "Teacher", "mother_occupation": "Homemaker"}, "essay": "I am passionate about computer science and want to contribute to technological advancement in India."}', '2024-01-15 10:30:00');

-- Create sample review for the application
INSERT INTO reviews (application_id, reviewer_id, criteria, overall_score, comments, recommendation, is_complete) VALUES
(1, 3, '{"academic_performance": 9, "financial_need": 8, "essay_quality": 8, "extracurricular": 7}', 8.00, 'Strong academic performance and clear financial need. Well-written essay demonstrating passion for the field.', 'approve', TRUE);

-- Create sample contribution from demo donor
INSERT INTO contributions (donor_id, scholarship_id, amount, status, contribution_type, notes, created_at, completed_at) VALUES
(4, 1, 50000.00, 'completed', 'one_time', 'Initial funding for Merit Excellence Scholarship program', '2024-01-01 09:00:00', '2024-01-01 09:15:00');

-- Verify table creation
SELECT 'Database setup completed successfully!' as status;
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as scholarship_count FROM scholarships;
SELECT COUNT(*) as application_count FROM applications;
SELECT COUNT(*) as notification_count FROM notifications;

COMMIT;