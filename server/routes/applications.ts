import { Router } from "express";
import { authenticateToken, authorize } from "../utils/auth";
import { mockDatabase } from "../config/database";
import {
  ApiResponse,
  PaginatedResponse,
  Application,
} from "../../shared/types/database";

const router = Router();

// List applications with optional filters (admin only)
router.get("/", authenticateToken, authorize("admin"), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      studentId,
      scholarshipId,
    } = req.query as any;
    const result = await mockDatabase.getApplications({
      page: Number(page),
      limit: Number(limit),
      status: status as any,
      studentId: studentId ? Number(studentId) : undefined,
      scholarshipId: scholarshipId ? Number(scholarshipId) : undefined,
    });

    const enriched = await Promise.all(
      (result.data as any[]).map(async (r: any) => {
        try {
          const [u, s] = await Promise.all([
            mockDatabase.findUserById(r.studentId),
            mockDatabase.getScholarshipById(r.scholarshipId),
          ]);
          return {
            ...r,
            studentName: u ? `${u.firstName || ""} ${u.lastName || ""}`.trim() : null,
            scholarshipTitle: s ? s.title : null,
          };
        } catch {
          return r;
        }
      })
    );

    const response: PaginatedResponse<Application> = {
      success: true,
      data: enriched as any,
      pagination: result.pagination,
      message: "Applications retrieved successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("List applications error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Stats (admin only)
router.get(
  "/stats",
  authenticateToken,
  authorize("admin"),
  async (_req, res) => {
    try {
      const stats = await mockDatabase.getApplicationStats();
      const response: ApiResponse = {
        success: true,
        data: stats,
        message: "Stats retrieved successfully",
      };
      res.json(response);
    } catch (error) {
      console.error("Applications stats error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  },
);

// Recent applications (admin only)
router.get(
  "/recent",
  authenticateToken,
  authorize("admin"),
  async (req, res) => {
    try {
      const limit = Number((req.query.limit as any) || 5);
      const recent = await mockDatabase.getRecentApplications(limit);
      const enriched = await Promise.all(
        (recent as any[]).map(async (r: any) => {
          try {
            const [u, s] = await Promise.all([
              mockDatabase.findUserById(r.studentId),
              mockDatabase.getScholarshipById(r.scholarshipId),
            ]);
            return {
              ...r,
              studentName: u ? `${u.firstName || ""} ${u.lastName || ""}`.trim() : null,
              scholarshipTitle: s ? s.title : null,
            };
          } catch {
            return r;
          }
        })
      );
      const response: ApiResponse<Application[]> = {
        success: true,
        data: enriched as any,
        message: "Recent applications",
      };
      res.json(response);
    } catch (error) {
      console.error("Recent applications error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  },
);

// Export CSV (admin only)
router.get(
  "/export",
  authenticateToken,
  authorize("admin"),
  async (req, res) => {
    try {
      const { status } = req.query as any;
      const all = await mockDatabase.getApplications({
        page: 1,
        limit: 10000,
        status: status as any,
      });
      const rowsRaw = all.data as any[];
      const rows = await Promise.all(
        rowsRaw.map(async (r) => {
          try {
            const [u, s] = await Promise.all([
              mockDatabase.findUserById(r.studentId),
              mockDatabase.getScholarshipById(r.scholarshipId),
            ]);
            return {
              ...r,
              studentName: u ? `${u.firstName || ""} ${u.lastName || ""}`.trim() : "",
              scholarshipTitle: s ? s.title : "",
            };
          } catch {
            return { ...r, studentName: "", scholarshipTitle: "" };
          }
        })
      );
      const headers = [
        "id",
        "studentId",
        "studentName",
        "scholarshipId",
        "scholarshipTitle",
        "status",
        "score",
        "amountAwarded",
        "assignedReviewerId",
        "submittedAt",
        "updatedAt",
      ];
      const csv = [headers.join(",")]
        .concat(
          rows.map((r) =>
            headers
              .map((h) => {
                const v = (r as any)[h] != null ? (r as any)[h] : "";
                if (v instanceof Date) return new Date(v).toISOString();
                const s = String(v).replace(/"/g, '""');
                return /[",\n]/.test(s) ? `"${s}"` : s;
              })
              .join(","),
          ),
        )
        .join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="applications.csv"',
      );
      res.send(csv);
    } catch (error) {
      console.error("Export applications error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  },
);

// Student: my applications
router.get("/my", authenticateToken, async (req: any, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query as any;
    const result = await mockDatabase.getApplications({
      page: Number(page),
      limit: Number(limit),
      status: status as any,
      studentId: req.user?.id,
    });
    const response: PaginatedResponse<Application> = {
      success: true,
      data: result.data,
      pagination: result.pagination,
      message: "My applications",
    };
    res.json(response);
  } catch (error) {
    console.error("My applications error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Student: my stats
router.get("/my/stats", authenticateToken, async (req: any, res) => {
  try {
    const stats = await mockDatabase.getApplicationStatsForStudent(
      req.user?.id,
    );
    const response: ApiResponse = {
      success: true,
      data: stats,
      message: "My stats",
    };
    res.json(response);
  } catch (error) {
    console.error("My applications stats error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Student: create application
router.post("/", authenticateToken, async (req: any, res) => {
  try {
    const { scholarshipId, applicationData, documents } = req.body || {};
    if (!scholarshipId)
      return res
        .status(400)
        .json({ success: false, error: "scholarshipId is required" });
    const created = await mockDatabase.createApplication(
      { scholarshipId, applicationData, documents },
      req.user?.id,
    );
    const response: ApiResponse<Application> = {
      success: true,
      data: created,
      message: "Application submitted",
    };
    res.status(201).json(response);
  } catch (error) {
    console.error("Create application error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
