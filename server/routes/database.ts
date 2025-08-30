
import { Router } from "express";
import { mockDatabase, getDbStatus } from "../config/database";

const router = Router();

// Get comprehensive database information
router.get("/explorer", async (req, res) => {
  try {
    console.log("📊 Database explorer request received");
    
    // Get database status
    const dbStatus = getDbStatus();
    
    // Get all data from different tables
    const [users, scholarships, applications, announcements] = await Promise.allSettled([
      mockDatabase.listUsers({ limit: 100 }),
      mockDatabase.getAllScholarships(),
      mockDatabase.getApplications({ limit: 100 }),
      mockDatabase.getAnnouncements({ limit: 50 })
    ]);

    const usersData = users.status === 'fulfilled' ? users.value || [] : [];
    const scholarshipsData = scholarships.status === 'fulfilled' ? scholarships.value || [] : [];
    const applicationsResult = applications.status === 'fulfilled' ? applications.value : null;
    const applicationsData = applicationsResult?.data || [];
    const announcementsData = announcements.status === 'fulfilled' ? announcements.value || [] : [];

    // Generate statistics
    const stats = {
      totalUsers: usersData.length,
      totalScholarships: scholarshipsData.length,
      totalApplications: applicationsData.length,
      totalAnnouncements: announcementsData.length,
      usersByType: usersData.reduce((acc: any, user: any) => {
        acc[user.userType] = (acc[user.userType] || 0) + 1;
        return acc;
      }, {}),
      applicationsByStatus: applicationsData.reduce((acc: any, app: any) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {}),
      scholarshipsByStatus: scholarshipsData.reduce((acc: any, sch: any) => {
        acc[sch.status] = (acc[sch.status] || 0) + 1;
        return acc;
      }, {})
    };

    // Database schema information
    const schema = {
      tables: {
        users: {
          description: "All user accounts (students, admins, reviewers, donors, surveyors)",
          columns: [
            { name: "id", type: "BIGSERIAL", primary: true },
            { name: "email", type: "TEXT", unique: true, required: true },
            { name: "password", type: "TEXT", required: true },
            { name: "firstName", type: "TEXT", required: true },
            { name: "lastName", type: "TEXT", required: true },
            { name: "phone", type: "TEXT" },
            { name: "userType", type: "user_type ENUM", required: true },
            { name: "isActive", type: "BOOLEAN", default: true },
            { name: "emailVerified", type: "BOOLEAN", default: false },
            { name: "profileData", type: "JSONB" },
            { name: "createdAt", type: "TIMESTAMPTZ", default: "NOW()" },
            { name: "updatedAt", type: "TIMESTAMPTZ", default: "NOW()" }
          ],
          recordCount: usersData.length
        },
        scholarships: {
          description: "Scholarship programs and funding opportunities",
          columns: [
            { name: "id", type: "BIGSERIAL", primary: true },
            { name: "title", type: "TEXT", required: true },
            { name: "description", type: "TEXT", required: true },
            { name: "amount", type: "NUMERIC(10,2)", required: true },
            { name: "currency", type: "TEXT", default: "INR" },
            { name: "eligibilityCriteria", type: "JSONB", required: true },
            { name: "requiredDocuments", type: "JSONB", required: true },
            { name: "applicationDeadline", type: "TIMESTAMPTZ", required: true },
            { name: "selectionDeadline", type: "TIMESTAMPTZ" },
            { name: "maxApplications", type: "INTEGER" },
            { name: "currentApplications", type: "INTEGER", default: 0 },
            { name: "status", type: "TEXT", default: "active" },
            { name: "createdBy", type: "BIGINT" },
            { name: "tags", type: "JSONB" }
          ],
          recordCount: scholarshipsData.length
        },
        applications: {
          description: "Student scholarship applications",
          columns: [
            { name: "id", type: "BIGSERIAL", primary: true },
            { name: "scholarshipId", type: "BIGINT", required: true },
            { name: "studentId", type: "BIGINT", required: true },
            { name: "status", type: "application_status", default: "submitted" },
            { name: "score", type: "INTEGER" },
            { name: "amountAwarded", type: "NUMERIC(10,2)" },
            { name: "assignedReviewerId", type: "BIGINT" },
            { name: "reviewNotes", type: "TEXT" },
            { name: "formData", type: "JSONB" },
            { name: "documents", type: "JSONB" },
            { name: "submittedAt", type: "TIMESTAMPTZ", default: "NOW()" },
            { name: "updatedAt", type: "TIMESTAMPTZ", default: "NOW()" }
          ],
          recordCount: applicationsData.length
        },
        application_reviews: {
          description: "Application evaluation and scoring",
          columns: [
            { name: "id", type: "BIGSERIAL", primary: true },
            { name: "applicationId", type: "BIGINT", required: true },
            { name: "reviewerId", type: "BIGINT", required: true },
            { name: "criteria", type: "JSONB" },
            { name: "overallScore", type: "INTEGER" },
            { name: "comments", type: "TEXT" },
            { name: "recommendation", type: "recommendation_type" },
            { name: "isComplete", type: "BOOLEAN", default: true }
          ],
          recordCount: 0
        },
        announcements: {
          description: "System announcements and notifications",
          columns: [
            { name: "id", type: "BIGSERIAL", primary: true },
            { name: "title", type: "TEXT", required: true },
            { name: "content", type: "TEXT", required: true },
            { name: "type", type: "TEXT", default: "general" },
            { name: "targetAudience", type: "JSONB" },
            { name: "isActive", type: "BOOLEAN", default: true },
            { name: "priority", type: "TEXT", default: "normal" },
            { name: "validFrom", type: "TIMESTAMPTZ", default: "NOW()" },
            { name: "validTo", type: "TIMESTAMPTZ" }
          ],
          recordCount: announcementsData.length
        },
        roles: {
          description: "System roles and permissions",
          columns: [
            { name: "id", type: "BIGSERIAL", primary: true },
            { name: "name", type: "TEXT", unique: true, required: true },
            { name: "description", type: "TEXT" },
            { name: "permissions", type: "JSONB" },
            { name: "isSystem", type: "BOOLEAN", default: false }
          ],
          recordCount: 5
        },
        user_roles: {
          description: "User role assignments (junction table)",
          columns: [
            { name: "id", type: "BIGSERIAL", primary: true },
            { name: "userId", type: "BIGINT", required: true },
            { name: "roleId", type: "BIGINT", required: true }
          ],
          recordCount: usersData.length
        }
      }
    };

    res.json({
      success: true,
      data: {
        schema,
        stats,
        dbStatus,
        liveData: {
          users: usersData.slice(0, 10), // Limit for performance
          scholarships: scholarshipsData.slice(0, 10),
          applications: applicationsData.slice(0, 10),
          announcements: announcementsData.slice(0, 10)
        }
      },
      message: "Database explorer data retrieved successfully"
    });

  } catch (error) {
    console.error("Database explorer error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve database information",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Get specific table data
router.get("/table/:tableName", async (req, res) => {
  try {
    const { tableName } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    let data: any[] = [];
    
    switch (tableName.toLowerCase()) {
      case 'users':
        data = await mockDatabase.listUsers({ limit: Number(limit) });
        break;
      case 'scholarships':
        data = await mockDatabase.getAllScholarships();
        data = data.slice(Number(offset), Number(offset) + Number(limit));
        break;
      case 'applications':
        const appResult = await mockDatabase.getApplications({ 
          limit: Number(limit), 
          page: Math.floor(Number(offset) / Number(limit)) + 1 
        });
        data = appResult.data || [];
        break;
      case 'announcements':
        data = await mockDatabase.getAnnouncements({ limit: Number(limit) });
        break;
      default:
        return res.status(400).json({
          success: false,
          error: "Invalid table name"
        });
    }

    res.json({
      success: true,
      data,
      table: tableName,
      count: data.length,
      message: `${tableName} data retrieved successfully`
    });

  } catch (error) {
    console.error(`Get ${req.params.tableName} error:`, error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve table data",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router;
