import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

// Mock data store for WebContainer environment
class MockDatabase {
  private users: any[] = [
    {
      id: 1,
      email: 'student@ydf.org',
      password: '$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS',
      firstName: 'Demo',
      lastName: 'Student',
      phone: '+91 9876543210',
      userType: 'student',
      isActive: true,
      emailVerified: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      profileData: { course: 'B.Tech Computer Science', college: 'Demo College', year: '3rd Year', cgpa: '8.75' }
    },
    {
      id: 2,
      email: 'admin@ydf.org',
      password: '$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS',
      firstName: 'Demo',
      lastName: 'Admin',
      phone: '+91 9876543211',
      userType: 'admin',
      isActive: true,
      emailVerified: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      profileData: { department: 'Administration', role: 'System Administrator' }
    },
    {
      id: 3,
      email: 'reviewer@ydf.org',
      password: '$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS',
      firstName: 'Demo',
      lastName: 'Reviewer',
      phone: '+91 9876543212',
      userType: 'reviewer',
      isActive: true,
      emailVerified: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      profileData: { specialization: 'Academic Review', experience: '5 years' }
    },
    {
      id: 4,
      email: 'donor@ydf.org',
      password: '$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS',
      firstName: 'Demo',
      lastName: 'Donor',
      phone: '+91 9876543213',
      userType: 'donor',
      isActive: true,
      emailVerified: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      profileData: { organization: 'Demo Foundation', type: 'Individual' }
    }
  ];

  private scholarships: any[] = [
    {
      id: 1,
      title: 'Merit Excellence Scholarship',
      description: 'Supporting academically excellent students with financial assistance to pursue their educational goals.',
      amount: '50000.00',
      currency: 'INR',
      eligibilityCriteria: ['CGPA above 8.5', 'Annual family income below ₹5 lakhs', 'Currently enrolled in UG/PG program'],
      requiredDocuments: ['Academic transcripts', 'Income certificate', 'Aadhaar card', 'Bank account details'],
      applicationDeadline: new Date('2024-03-15'),
      maxApplications: null,
      currentApplications: 0,
      status: 'active',
      createdBy: 2,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      tags: ['Academic', 'Merit-based', 'UG/PG']
    },
    {
      id: 2,
      title: 'Rural Girls Education Grant',
      description: 'Empowering rural girls through education by providing financial support for higher studies.',
      amount: '35000.00',
      currency: 'INR',
      eligibilityCriteria: ['Female candidates only', 'From rural areas', 'Family income below ₹3 lakhs', 'Age between 18-25 years'],
      requiredDocuments: ['Income certificate', 'Rural residence proof', 'Academic records', 'Aadhaar card'],
      applicationDeadline: new Date('2024-04-20'),
      maxApplications: null,
      currentApplications: 0,
      status: 'active',
      createdBy: 2,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      tags: ['Gender', 'Rural', 'Empowerment']
    }
  ];

  private applications: any[] = [];
  private notifications: any[] = [];
  private nextId = { users: 5, scholarships: 3, applications: 1, notifications: 1 };

  // Mock query methods
  async select() {
    return {
      from: (table: any) => ({
        where: (condition: any) => ({
          limit: (limit: number) => this.users.slice(0, limit),
          returning: () => this.users
        }),
        limit: (limit: number) => this.users.slice(0, limit),
        orderBy: (order: any) => this.scholarships,
        returning: () => this.users
      })
    };
  }

  async insert(table: any) {
    return {
      values: (data: any) => ({
        returning: () => {
          if (table === 'users') {
            const newUser = { ...data, id: this.nextId.users++, createdAt: new Date(), updatedAt: new Date() };
            this.users.push(newUser);
            return [newUser];
          }
          return [data];
        }
      })
    };
  }

  async update(table: any) {
    return {
      set: (data: any) => ({
        where: (condition: any) => ({
          returning: () => {
            // Mock update logic
            return [{ ...data, updatedAt: new Date() }];
          }
        })
      })
    };
  }

  // User operations
  async findUserByEmail(email: string) {
    return this.users.find(user => user.email === email) || null;
  }

  async findUserById(id: number) {
    return this.users.find(user => user.id === id) || null;
  }

  async createUser(userData: any) {
    const newUser = {
      ...userData,
      id: this.nextId.users++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: number, userData: any) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...userData, updatedAt: new Date() };
      return this.users[userIndex];
    }
    return null;
  }

  // Scholarship operations
  async getAllScholarships() {
    return this.scholarships;
  }

  async getScholarshipById(id: number) {
    return this.scholarships.find(scholarship => scholarship.id === id) || null;
  }
}

// Create mock database instance
const mockDb = new MockDatabase();

// Connection configuration (for reference)
const connectionConfig = {
  host: 'bluehost.in',
  port: 3306,
  user: 'sparsind_ydf',
  password: 'Vishwanath!@3',
  database: 'sparsind_ydf_ngo',
  ssl: {
    rejectUnauthorized: false
  }
};

// Export mock database as db for compatibility
export const db = {
  select: () => ({
    from: (table: any) => ({
      where: (condition: any) => ({
        limit: (limit: number) => {
          if (table._.name === 'users') {
            return Promise.resolve(mockDb.users.slice(0, limit));
          }
          if (table._.name === 'scholarships') {
            return Promise.resolve(mockDb.scholarships.slice(0, limit));
          }
          return Promise.resolve([]);
        }
      }),
      limit: (limit: number) => {
        if (table._.name === 'users') {
          return Promise.resolve(mockDb.users.slice(0, limit));
        }
        if (table._.name === 'scholarships') {
          return Promise.resolve(mockDb.scholarships.slice(0, limit));
        }
        return Promise.resolve([]);
      },
      orderBy: (order: any) => Promise.resolve(mockDb.scholarships)
    })
  }),
  insert: (table: any) => ({
    values: (data: any) => ({
      returning: () => {
        if (table._.name === 'users') {
          return Promise.resolve([mockDb.createUser(data)]);
        }
        return Promise.resolve([data]);
      }
    })
  }),
  update: (table: any) => ({
    set: (data: any) => ({
      where: (condition: any) => ({
        returning: () => Promise.resolve([{ ...data, updatedAt: new Date() }])
      })
    })
  })
};

// Mock database operations for direct use
export const mockDatabase = mockDb;

// Test connection function
export async function testConnection() {
  try {
    console.log('🔄 Testing mock database connection...');
    
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('✅ Mock database connection successful');
    return { 
      success: true, 
      data: [{
        version: 'Mock MySQL 8.0.0',
        current_time: new Date().toISOString(),
        database_name: 'sparsind_ydf_ngo'
      }],
      message: 'Mock database connection successful'
    };
  } catch (error) {
    console.error('❌ Mock database connection failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Initialize database function
export async function initializeDatabase() {
  try {
    console.log('🔄 Initializing mock database...');
    
    // Simulate table creation
    await new Promise(resolve => setTimeout(resolve, 200));
    
    console.log('✅ Mock database initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Mock database initialization failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Create default users function
export async function createDefaultUsers() {
  try {
    console.log('👥 Mock default users already available...');
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Export pool for compatibility (mock)
export const mysql = {
  getConnection: async () => ({
    execute: async (query: string, params?: any[]) => {
      // Mock execute function
      if (query.includes('SELECT VERSION()')) {
        return [[{ version: 'Mock MySQL 8.0.0', current_time: new Date(), database_name: 'sparsind_ydf_ngo' }]];
      }
      if (query.includes('SHOW TABLES')) {
        return [['users', 'scholarships', 'applications', 'reviews', 'notifications', 'documents', 'announcements', 'contributions', 'settings'].map(name => ({ [`Tables_in_sparsind_ydf_ngo`]: name }))];
      }
      if (query.includes('SELECT COUNT(*)')) {
        return [[{ count: 10 }]];
      }
      return [[]];
    },
    ping: async () => true,
    end: async () => {},
    release: () => {}
  })
};