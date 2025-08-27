import mysql from "mysql2/promise";
import { hashPassword } from "../utils/auth";

// Determine whether to use mock DB (default false if full credentials are provided)
const useMockExplicit =
  (process.env.USE_MOCK_DB || "").toLowerCase() === "true";

const DB_HOST = (process.env.DB_HOST || "").trim();
const DB_PORT = parseInt(process.env.DB_PORT || "3306", 10);
const DB_USER = (process.env.DB_USER || "").trim();
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = (process.env.DB_NAME || "").trim();

const hasCreds = DB_HOST && DB_USER && DB_PASSWORD && DB_NAME;
const USE_MOCK = useMockExplicit || !hasCreds;

// In-memory fallback store
class InMemoryStore {
  public users: any[] = [
    {
      id: 1,
      email: "student@ydf.org",
      password: "$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS",
      firstName: "Demo",
      lastName: "Student",
      phone: "+91 9876543210",
      userType: "student",
      isActive: true,
      emailVerified: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      profileData: {
        course: "B.Tech Computer Science",
        college: "Demo College",
        year: "3rd Year",
        cgpa: "8.75",
      },
    },
    {
      id: 2,
      email: "admin@ydf.org",
      password: "$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS",
      firstName: "Demo",
      lastName: "Admin",
      phone: "+91 9876543211",
      userType: "admin",
      isActive: true,
      emailVerified: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      profileData: {
        department: "Administration",
        role: "System Administrator",
      },
    },
    {
      id: 3,
      email: "reviewer@ydf.org",
      password: "$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS",
      firstName: "Demo",
      lastName: "Reviewer",
      phone: "+91 9876543212",
      userType: "reviewer",
      isActive: true,
      emailVerified: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      profileData: { specialization: "Academic Review", experience: "5 years" },
    },
    {
      id: 4,
      email: "donor@ydf.org",
      password: "$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS",
      firstName: "Demo",
      lastName: "Donor",
      phone: "+91 9876543213",
      userType: "donor",
      isActive: true,
      emailVerified: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      profileData: { organization: "Demo Foundation", type: "Individual" },
    },
    {
      id: 5,
      email: "surveyor@ydf.org",
      password: "$2a$12$LQv3c1yqBw2YwjVVRRp0Oe6slHh9UNdCHbyBgTcbZ2fP0S5w7/5gS",
      firstName: "Demo",
      lastName: "Surveyor",
      phone: "+91 9876543214",
      userType: "surveyor",
      isActive: true,
      emailVerified: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      profileData: { department: "Field Verification" },
    },
  ];

  public scholarships: any[] = [
    {
      id: 1,
      title: "Merit Excellence Scholarship",
      description: "Supporting academically excellent students",
      amount: "50000",
      currency: "INR",
      eligibilityCriteria: ["CGPA above 8.5", "Income < 5L"],
      requiredDocuments: ["Transcripts", "Income certificate"],
      applicationDeadline: new Date(Date.now() + 1000*60*60*24*30),
      selectionDeadline: null,
      maxApplications: 1000,
      currentApplications: 0,
      status: "active",
      createdBy: 2,
      tags: ["Academic", "Merit"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}

const memory = new InMemoryStore();

// MySQL pool
export const pool = !USE_MOCK
  ? mysql.createPool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 30000,
      ...(String(process.env.DB_SSL || "").toLowerCase() === "true"
        ? { ssl: { rejectUnauthorized: false } }
        : {}),
    } as any)
  : (null as unknown as mysql.Pool);

// Provide a compatibility wrapper like previous `mysql.getConnection()` export
export const mysqlCompat = {
  getConnection: async () => {
    if (USE_MOCK || !pool) {
      return {
        execute: async (_q: string, _p?: any[]) => [[]],
        ping: async () => true,
        end: async () => {},
        release: () => {},
      } as any;
    }
    return pool.getConnection();
  },
} as any;

// Helper to ensure tables exist in MySQL
async function ensureUsersTable() {
  if (USE_MOCK || !pool) return;
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      firstName VARCHAR(100) NOT NULL,
      lastName VARCHAR(100) NOT NULL,
      phone VARCHAR(50),
      userType ENUM('student','admin','reviewer','donor','surveyor') NOT NULL,
      isActive TINYINT(1) NOT NULL DEFAULT 1,
      emailVerified TINYINT(1) NOT NULL DEFAULT 0,
      profileData JSON NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  try {
    const [cols]: any = await pool.execute(
      "SHOW COLUMNS FROM users LIKE 'userType'",
    );
    const col = (cols as any[])[0];
    const typeStr = (col && col.Type) || (col && col["Type"]);
    if (typeStr && !String(typeStr).includes("surveyor")) {
      await pool.execute(
        `ALTER TABLE users MODIFY COLUMN userType ENUM('student','admin','reviewer','donor','surveyor') NOT NULL`,
      );
    }
  } catch (e) {
    console.warn(
      "Could not verify/alter users.userType enum:",
      e instanceof Error ? e.message : e,
    );
  }
}

async function ensureScholarshipsTable() {
  if (USE_MOCK || !pool) return;
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS scholarships (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      currency VARCHAR(10) DEFAULT 'INR',
      eligibilityCriteria JSON NOT NULL,
      requiredDocuments JSON NOT NULL,
      applicationDeadline DATETIME NOT NULL,
      selectionDeadline DATETIME NULL,
      maxApplications INT NULL,
      currentApplications INT DEFAULT 0,
      status VARCHAR(20) DEFAULT 'active',
      createdBy INT NULL,
      tags JSON NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

// Adapter to provide the same interface used by routes
class DatabaseAdapter {
  async findUserByEmail(email: string) {
    if (USE_MOCK || !pool) {
      return memory.users.find((u) => u.email === email) || null;
    }
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email],
    );
    return (rows as any[])[0] || null;
  }

  async findUserById(id: number) {
    if (USE_MOCK || !pool) {
      return memory.users.find((u) => u.id === id) || null;
    }
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE id = ? LIMIT 1",
      [id],
    );
    return (rows as any[])[0] || null;
  }

  async createUser(userData: any) {
    if (USE_MOCK || !pool) {
      const newUser = {
        ...userData,
        id: memory.users.length + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memory.users.push(newUser);
      return newUser;
    }
    const fields = [
      "email",
      "password",
      "firstName",
      "lastName",
      "phone",
      "userType",
      "isActive",
      "emailVerified",
      "profileData",
    ];
    const values = [
      userData.email,
      userData.password,
      userData.firstName,
      userData.lastName,
      userData.phone ?? null,
      userData.userType,
      userData.isActive ? 1 : 0,
      userData.emailVerified ? 1 : 0,
      userData.profileData ? JSON.stringify(userData.profileData) : null,
    ];
    const placeholders = fields.map(() => "?").join(",");
    const sql = `INSERT INTO users (${fields.join(",")}) VALUES (${placeholders})`;
    const [result]: any = await pool.execute(sql, values);
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE id = ? LIMIT 1",
      [result.insertId],
    );
    return (rows as any[])[0];
  }

  async updateUser(id: number, userData: any) {
    if (USE_MOCK || !pool) {
      const idx = memory.users.findIndex((u) => u.id === id);
      if (idx === -1) return null;
      memory.users[idx] = {
        ...memory.users[idx],
        ...userData,
        updatedAt: new Date(),
      };
      return memory.users[idx];
    }
    const columns: string[] = [];
    const values: any[] = [];
    for (const [key, val] of Object.entries(userData)) {
      if (
        [
          "email",
          "password",
          "firstName",
          "lastName",
          "phone",
          "userType",
          "isActive",
          "emailVerified",
          "profileData",
        ].includes(key)
      ) {
        columns.push(`${key} = ?`);
        values.push(
          key === "profileData" && val != null ? JSON.stringify(val) : val,
        );
      }
    }
    if (!columns.length) {
      const [rows] = await pool.execute(
        "SELECT * FROM users WHERE id = ? LIMIT 1",
        [id],
      );
      return (rows as any[])[0] || null;
    }
    const sql = `UPDATE users SET ${columns.join(", ")}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
    values.push(id);
    await pool.execute(sql, values);
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE id = ? LIMIT 1",
      [id],
    );
    return (rows as any[])[0] || null;
  }

  // Scholarships CRUD
  async getAllScholarships() {
    if (USE_MOCK || !pool) {
      return memory.scholarships.sort((a: any, b: any) => (b.createdAt as any) - (a.createdAt as any));
    }
    await ensureScholarshipsTable();
    const [rows] = await pool.execute("SELECT * FROM scholarships ORDER BY createdAt DESC");
    return rows as any[];
  }

  async getScholarshipById(id: number) {
    if (USE_MOCK || !pool) {
      return memory.scholarships.find((s: any) => s.id === id) || null;
    }
    await ensureScholarshipsTable();
    const [rows] = await pool.execute("SELECT * FROM scholarships WHERE id = ? LIMIT 1", [id]);
    return (rows as any[])[0] || null;
  }

  async createScholarship(input: any, createdBy?: number) {
    const now = new Date();
    if (USE_MOCK || !pool) {
      const nextId = memory.scholarships.length ? Math.max(...memory.scholarships.map((s:any)=>s.id)) + 1 : 1;
      const rec = { id: nextId, ...input, createdBy: createdBy ?? null, currentApplications: 0, status: input.status || 'active', createdAt: now, updatedAt: now };
      memory.scholarships.unshift(rec);
      return rec;
    }
    await ensureScholarshipsTable();
    const fields = ['title','description','amount','currency','eligibilityCriteria','requiredDocuments','applicationDeadline','selectionDeadline','maxApplications','currentApplications','status','createdBy','tags'];
    const values = [input.title, input.description, input.amount, input.currency || 'INR', JSON.stringify(input.eligibilityCriteria), JSON.stringify(input.requiredDocuments), input.applicationDeadline, input.selectionDeadline ?? null, input.maxApplications ?? null, 0, input.status || 'active', createdBy ?? null, input.tags ? JSON.stringify(input.tags) : null];
    const placeholders = fields.map(()=>'?').join(',');
    const [result]: any = await pool.execute(`INSERT INTO scholarships (${fields.join(',')}) VALUES (${placeholders})`, values);
    const [rows] = await pool.execute('SELECT * FROM scholarships WHERE id = ? LIMIT 1', [result.insertId]);
    return (rows as any[])[0];
  }

  async updateScholarship(id: number, data: any) {
    if (USE_MOCK || !pool) {
      const idx = memory.scholarships.findIndex((s:any)=> s.id === id);
      if (idx === -1) return null;
      memory.scholarships[idx] = { ...memory.scholarships[idx], ...data, updatedAt: new Date() };
      return memory.scholarships[idx];
    }
    await ensureScholarshipsTable();
    const cols: string[] = []; const vals: any[] = [];
    for (const [k,v] of Object.entries(data)) {
      if (['title','description','amount','currency','eligibilityCriteria','requiredDocuments','applicationDeadline','selectionDeadline','maxApplications','currentApplications','status','tags'].includes(k)) {
        cols.push(`${k} = ?`);
        vals.push((k==='eligibilityCriteria'||k==='requiredDocuments'||k==='tags') && v!=null ? JSON.stringify(v) : v);
      }
    }
    if (!cols.length) return this.getScholarshipById(id);
    vals.push(id);
    await pool.execute(`UPDATE scholarships SET ${cols.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`, vals);
    const [rows] = await pool.execute('SELECT * FROM scholarships WHERE id = ? LIMIT 1', [id]);
    return (rows as any[])[0];
  }

  async deleteScholarship(id: number) {
    if (USE_MOCK || !pool) {
      const idx = memory.scholarships.findIndex((s:any)=> s.id === id);
      if (idx === -1) return false;
      memory.scholarships.splice(idx,1);
      return true;
    }
    await ensureScholarshipsTable();
    await pool.execute('DELETE FROM scholarships WHERE id = ?', [id]);
    return true;
  }
}

export const mockDatabase = new DatabaseAdapter();

// Public API for server/index.ts and routes/test.ts
export async function testConnection() {
  try {
    if (USE_MOCK || !pool) {
      return {
        success: true,
        data: [
          {
            version: "Mock MySQL 8.0.0",
            current_time: new Date().toISOString(),
            database_name: DB_NAME || "in-memory",
          },
        ],
        message: "Mock database connection successful",
      };
    }
    const conn = await pool.getConnection();
    const [rows] = await conn.query("SELECT VERSION() as version");
    conn.release();
    return {
      success: true,
      data: [
        {
          version: (rows as any[])[0].version,
          current_time: new Date().toISOString(),
          database_name: DB_NAME,
        },
      ],
      message: "Database connection successful",
    };
  } catch (error) {
    console.error("Database connection failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function initializeDatabase() {
  try {
    if (USE_MOCK || !pool) {
      return { success: true };
    }
    await ensureUsersTable();
    await ensureScholarshipsTable();
    return { success: true };
  } catch (error) {
    console.error("Database initialization failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function createDefaultUsers() {
  try {
    const defaults = [
      {
        email: "student@ydf.org",
        password: "Student123!",
        firstName: "Demo",
        lastName: "Student",
        phone: "+91 9876543210",
        userType: "student",
        profileData: {
          course: "B.Tech Computer Science",
          college: "Demo College",
        },
        isActive: true,
        emailVerified: true,
      },
      {
        email: "admin@ydf.org",
        password: "Admin123!",
        firstName: "Demo",
        lastName: "Admin",
        phone: "+91 9876543211",
        userType: "admin",
        profileData: { department: "Administration" },
        isActive: true,
        emailVerified: true,
      },
      {
        email: "reviewer@ydf.org",
        password: "Reviewer123!",
        firstName: "Demo",
        lastName: "Reviewer",
        phone: "+91 9876543212",
        userType: "reviewer",
        profileData: { specialization: "Academic Review" },
        isActive: true,
        emailVerified: true,
      },
      {
        email: "donor@ydf.org",
        password: "Donor123!",
        firstName: "Demo",
        lastName: "Donor",
        phone: "+91 9876543213",
        userType: "donor",
        profileData: { organization: "Demo Foundation" },
        isActive: true,
        emailVerified: true,
      },
      {
        email: "surveyor@ydf.org",
        password: "Surveyor123!",
        firstName: "Demo",
        lastName: "Surveyor",
        phone: "+91 9876543214",
        userType: "surveyor",
        profileData: { department: "Field Verification" },
        isActive: true,
        emailVerified: true,
      },
    ];

    if (USE_MOCK || !pool) {
      for (const u of defaults) {
        const existing = memory.users.find((x) => x.email === u.email);
        const hashed = await hashPassword(u.password);
        if (!existing) {
          memory.users.push({
            id: memory.users.length ? Math.max(...memory.users.map((m: any) => m.id)) + 1 : 1,
            email: u.email,
            password: hashed,
            firstName: u.firstName,
            lastName: u.lastName,
            phone: u.phone,
            userType: u.userType,
            isActive: u.isActive,
            emailVerified: u.emailVerified,
            profileData: u.profileData,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else {
          existing.password = hashed;
          existing.userType = u.userType;
          existing.isActive = true;
          existing.emailVerified = true;
          existing.updatedAt = new Date();
        }
      }
      return { success: true };
    }

    await ensureUsersTable();

    for (const u of defaults) {
      const existing = await mockDatabase.findUserByEmail(u.email);
      if (!existing) {
        const hashed = await hashPassword(u.password);
        await mockDatabase.createUser({ ...u, password: hashed });
      } else {
        const toUpdate: any = {};
        if (existing.userType !== u.userType) toUpdate.userType = u.userType;
        if (existing.isActive !== u.isActive) toUpdate.isActive = u.isActive;
        if (existing.emailVerified !== u.emailVerified)
          toUpdate.emailVerified = u.emailVerified;
        if (Object.keys(toUpdate).length) {
          await mockDatabase.updateUser(existing.id, toUpdate);
        }
      }
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
