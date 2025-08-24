import { mysqlTable, text, int, timestamp, boolean, decimal, json, varchar } from 'drizzle-orm/mysql-core';

// Users table - for all user types (students, admins, reviewers, donors)
export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: text('password').notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  userType: varchar('user_type', { length: 20 }).notNull(), // 'student', 'admin', 'reviewer', 'donor'
  isActive: boolean('is_active').default(true),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  profileData: json('profile_data'), // Additional profile info based on user type
});

// Scholarship schemes table
export const scholarships = mysqlTable('scholarships', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).default('INR'),
  eligibilityCriteria: json('eligibility_criteria').notNull(),
  requiredDocuments: json('required_documents').notNull(),
  applicationDeadline: timestamp('application_deadline').notNull(),
  selectionDeadline: timestamp('selection_deadline'),
  maxApplications: int('max_applications'),
  currentApplications: int('current_applications').default(0),
  status: varchar('status', { length: 20 }).default('active'), // 'active', 'inactive', 'closed'
  createdBy: int('created_by'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  tags: json('tags'), // Array of tags for categorization
});

// Scholarship applications table
export const applications = mysqlTable('applications', {
  id: int('id').primaryKey().autoincrement(),
  studentId: int('student_id').notNull(),
  scholarshipId: int('scholarship_id').notNull(),
  status: varchar('status', { length: 20 }).default('submitted'), // 'submitted', 'under_review', 'approved', 'rejected', 'waitlisted'
  applicationData: json('application_data').notNull(), // Form responses
  documents: json('documents'), // Array of document URLs and metadata
  score: decimal('score', { precision: 5, scale: 2 }), // Review score
  reviewNotes: text('review_notes'),
  reviewedBy: int('reviewed_by'),
  submittedAt: timestamp('submitted_at').defaultNow(),
  reviewedAt: timestamp('reviewed_at'),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Reviews and evaluations table
export const reviews = mysqlTable('reviews', {
  id: int('id').primaryKey().autoincrement(),
  applicationId: int('application_id').notNull(),
  reviewerId: int('reviewer_id').notNull(),
  criteria: json('criteria').notNull(), // Evaluation criteria and scores
  overallScore: decimal('overall_score', { precision: 5, scale: 2 }).notNull(),
  comments: text('comments'),
  recommendation: varchar('recommendation', { length: 30 }), // 'approve', 'reject', 'conditionally_approve'
  isComplete: boolean('is_complete').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Notifications table
export const notifications = mysqlTable('notifications', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 20 }).notNull(), // 'application', 'deadline', 'announcement', 'message'
  isRead: boolean('is_read').default(false),
  relatedId: int('related_id'), // ID of related entity (scholarship, application, etc.)
  relatedType: varchar('related_type', { length: 50 }), // Type of related entity
  createdAt: timestamp('created_at').defaultNow(),
});

// Documents table
export const documents = mysqlTable('documents', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  applicationId: int('application_id'),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  originalName: varchar('original_name', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  fileSize: int('file_size').notNull(),
  fileUrl: text('file_url').notNull(),
  documentType: varchar('document_type', { length: 50 }).notNull(), // 'marksheet', 'certificate', 'id_proof', etc.
  isVerified: boolean('is_verified').default(false),
  verificationNotes: text('verification_notes'),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
});

// Announcements table
export const announcements = mysqlTable('announcements', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  type: varchar('type', { length: 20 }).default('general'), // 'general', 'deadline', 'result', 'maintenance'
  targetAudience: json('target_audience'), // Array of user types to show this to
  isActive: boolean('is_active').default(true),
  priority: varchar('priority', { length: 10 }).default('normal'), // 'low', 'normal', 'high', 'urgent'
  validFrom: timestamp('valid_from').defaultNow(),
  validTo: timestamp('valid_to'),
  createdBy: int('created_by'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Donor contributions table
export const contributions = mysqlTable('contributions', {
  id: int('id').primaryKey().autoincrement(),
  donorId: int('donor_id').notNull(),
  scholarshipId: int('scholarship_id'),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).default('INR'),
  paymentMethod: varchar('payment_method', { length: 50 }),
  paymentId: varchar('payment_id', { length: 255 }), // Payment gateway transaction ID
  status: varchar('status', { length: 20 }).default('pending'), // 'pending', 'completed', 'failed', 'refunded'
  contributionType: varchar('contribution_type', { length: 20 }).default('one_time'), // 'one_time', 'recurring'
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  completedAt: timestamp('completed_at'),
});

// Settings table for application configuration
export const settings = mysqlTable('settings', {
  id: int('id').primaryKey().autoincrement(),
  key: varchar('key', { length: 100 }).unique().notNull(),
  value: json('value').notNull(),
  description: text('description'),
  updatedBy: int('updated_by'),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});