import { pgTable, text, serial, timestamp, boolean, integer, decimal, jsonb } from 'drizzle-orm/pg-core';

// Users table - for all user types (students, admins, reviewers, donors)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phone: text('phone'),
  userType: text('user_type', { enum: ['student', 'admin', 'reviewer', 'donor'] }).notNull(),
  isActive: boolean('is_active').default(true),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  profileData: jsonb('profile_data'), // Additional profile info based on user type
});

// Scholarship schemes table
export const scholarships = pgTable('scholarships', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('INR'),
  eligibilityCriteria: jsonb('eligibility_criteria').notNull(),
  requiredDocuments: jsonb('required_documents').notNull(),
  applicationDeadline: timestamp('application_deadline').notNull(),
  selectionDeadline: timestamp('selection_deadline'),
  maxApplications: integer('max_applications'),
  currentApplications: integer('current_applications').default(0),
  status: text('status').default('active'), // 'active', 'inactive', 'closed'
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  tags: jsonb('tags'), // Array of tags for categorization
});

// Scholarship applications table
export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => users.id).notNull(),
  scholarshipId: integer('scholarship_id').references(() => scholarships.id).notNull(),
  status: text('status').default('submitted'), // 'submitted', 'under_review', 'approved', 'rejected', 'waitlisted'
  applicationData: jsonb('application_data').notNull(), // Form responses
  documents: jsonb('documents'), // Array of document URLs and metadata
  score: decimal('score', { precision: 5, scale: 2 }), // Review score
  reviewNotes: text('review_notes'),
  reviewedBy: integer('reviewed_by').references(() => users.id),
  submittedAt: timestamp('submitted_at').defaultNow(),
  reviewedAt: timestamp('reviewed_at'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Reviews and evaluations table
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id').references(() => applications.id).notNull(),
  reviewerId: integer('reviewer_id').references(() => users.id).notNull(),
  criteria: jsonb('criteria').notNull(), // Evaluation criteria and scores
  overallScore: decimal('overall_score', { precision: 5, scale: 2 }).notNull(),
  comments: text('comments'),
  recommendation: text('recommendation'), // 'approve', 'reject', 'conditionally_approve'
  isComplete: boolean('is_complete').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Notifications table
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull(), // 'application', 'deadline', 'announcement', 'message'
  isRead: boolean('is_read').default(false),
  relatedId: integer('related_id'), // ID of related entity (scholarship, application, etc.)
  relatedType: text('related_type'), // Type of related entity
  createdAt: timestamp('created_at').defaultNow(),
});

// Documents table
export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  applicationId: integer('application_id').references(() => applications.id),
  fileName: text('file_name').notNull(),
  originalName: text('original_name').notNull(),
  mimeType: text('mime_type').notNull(),
  fileSize: integer('file_size').notNull(),
  fileUrl: text('file_url').notNull(),
  documentType: text('document_type').notNull(), // 'marksheet', 'certificate', 'id_proof', etc.
  isVerified: boolean('is_verified').default(false),
  verificationNotes: text('verification_notes'),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
});

// Announcements table
export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  type: text('type').default('general'), // 'general', 'deadline', 'result', 'maintenance'
  targetAudience: jsonb('target_audience'), // Array of user types to show this to
  isActive: boolean('is_active').default(true),
  priority: text('priority').default('normal'), // 'low', 'normal', 'high', 'urgent'
  validFrom: timestamp('valid_from').defaultNow(),
  validTo: timestamp('valid_to'),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Donor contributions table
export const contributions = pgTable('contributions', {
  id: serial('id').primaryKey(),
  donorId: integer('donor_id').references(() => users.id).notNull(),
  scholarshipId: integer('scholarship_id').references(() => scholarships.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('INR'),
  paymentMethod: text('payment_method'),
  paymentId: text('payment_id'), // Payment gateway transaction ID
  status: text('status').default('pending'), // 'pending', 'completed', 'failed', 'refunded'
  contributionType: text('contribution_type').default('one_time'), // 'one_time', 'recurring'
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  completedAt: timestamp('completed_at'),
});

// Settings table for application configuration
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  key: text('key').unique().notNull(),
  value: jsonb('value').notNull(),
  description: text('description'),
  updatedBy: integer('updated_by').references(() => users.id),
  updatedAt: timestamp('updated_at').defaultNow(),
});
