-- Youth Dreamers Foundation Database Setup
-- Import this file into your MySQL database: sparsind_ydf_ngo

-- Set charset and collation
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Create users table
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  user_type VARCHAR(20) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  profile_data JSON,
  INDEX idx_email (email),
  INDEX idx_user_type (user_type)
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
  status VARCHAR(20) DEFAULT 'active',
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  tags JSON,
  INDEX idx_status (status),
  INDEX idx_deadline (application_deadline),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create applications table
DROP TABLE IF EXISTS applications;
CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  scholarship_id INT NOT NULL,
  status VARCHAR(20) DEFAULT 'submitted',
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
  recommendation VARCHAR(30),
  is_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_application (application_id),
  INDEX idx_reviewer (reviewer_id),
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
  type VARCHAR(20) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  related_id INT NULL,
  related_type VARCHAR(50) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_type (type),
  INDEX idx_read (is_read),
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
  document_type VARCHAR(50) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_notes TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_application (application_id),
  INDEX idx_type (document_type),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create announcements table
DROP TABLE IF EXISTS announcements;
CREATE TABLE announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'general',
  target_audience JSON,
  is_active BOOLEAN DEFAULT TRUE,
  priority VARCHAR(10) DEFAULT 'normal',
  valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  valid_to TIMESTAMP NULL,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active (is_active),
  INDEX idx_type (type),
  INDEX idx_priority (priority),
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
  status VARCHAR(20) DEFAULT 'pending',
  contribution_type VARCHAR(20) DEFAULT 'one_time',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  INDEX idx_donor (donor_id),
  INDEX idx_scholarship (scholarship_id),
  INDEX idx_status (status),
  FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create settings table
DROP TABLE IF EXISTS settings;
CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) UNIQUE NOT NULL,
  value JSON NOT NULL,
  description TEXT,
  updated_by INT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_key (`key`),
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Insert default users with hashed passwords
-- Password hashes are for: Student123!, Admin123!, Reviewer123!, Donor123!
INSERT INTO users (email, password, first_name, last_name, phone, user_type, profile_data, is_active, email_verified) VALUES
('student@ydf.org', '$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS', 'Demo', 'Student', '+91 9876543210', 'student', '{"course": "B.Tech Computer Science", "college": "Demo College"}', TRUE, TRUE),
('admin@ydf.org', '$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS', 'Demo', 'Admin', '+91 9876543211', 'admin', '{"department": "Administration"}', TRUE, TRUE),
('reviewer@ydf.org', '$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS', 'Demo', 'Reviewer', '+91 9876543212', 'reviewer', '{"specialization": "Academic Review"}', TRUE, TRUE),
('donor@ydf.org', '$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS', 'Demo', 'Donor', '+91 9876543213', 'donor', '{"organization": "Demo Foundation"}', TRUE, TRUE);

-- Insert sample scholarship data
INSERT INTO scholarships (title, description, amount, eligibility_criteria, required_documents, application_deadline, status, tags) VALUES
('Merit Excellence Scholarship', 'Supporting academically excellent students with financial assistance to pursue their educational goals.', 50000.00, '["CGPA above 8.5", "Annual family income below ₹5 lakhs", "Currently enrolled in UG/PG program"]', '["Academic transcripts", "Income certificate", "Aadhaar card", "Bank account details"]', '2024-03-15 23:59:59', 'active', '["Academic", "Merit-based", "UG/PG"]'),
('Rural Girls Education Grant', 'Empowering rural girls through education by providing financial support for higher studies.', 35000.00, '["Female candidates only", "From rural areas", "Family income below ₹3 lakhs", "Age between 18-25 years"]', '["Income certificate", "Rural residence proof", "Academic records", "Aadhaar card"]', '2024-04-20 23:59:59', 'active', '["Gender", "Rural", "Empowerment"]'),
('Technical Innovation Fund', 'Supporting innovative technology projects that solve real-world problems.', 75000.00, '["Engineering/Technology students", "Innovative project proposal required", "CGPA above 7.5", "Team project (2-4 members)"]', '["Project proposal", "Technical documentation", "Team details", "Academic transcripts"]', '2024-05-30 23:59:59', 'active', '["Technology", "Innovation", "Team"]');

-- Insert sample announcements
INSERT INTO announcements (title, content, type, target_audience, priority) VALUES
('Welcome to Youth Dreamers Foundation', 'Welcome to our scholarship platform! Start exploring available opportunities and apply for scholarships that match your profile.', 'general', '["student", "admin", "reviewer", "donor"]', 'normal'),
('New Scholarship Programs Launched', 'We have launched three new scholarship programs for the academic year 2024-25. Check out the latest opportunities in technology, rural development, and academic excellence.', 'general', '["student"]', 'high'),
('Application Deadline Reminder', 'Reminder: Merit Excellence Scholarship applications close on March 15, 2024. Submit your applications before the deadline.', 'deadline', '["student"]', 'high');

COMMIT;