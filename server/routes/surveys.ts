import { Router } from "express";
import { authenticateToken, authorize, AuthRequest } from "../utils/auth";
import { pool } from "../config/database";

const router = Router();

// In-memory fallback store
interface VerificationRec {
  id: number;
  applicationId: number;
  surveyorId: number;
  type: "home" | "document";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  startLat?: number | null;
  startLng?: number | null;
  endLat?: number | null;
  endLng?: number | null;
  startTime?: string | null;
  endTime?: string | null;
  notes?: string | null;
  photos?: any;
  createdAt: string;
  updatedAt: string;
}
const mem: { verifications: VerificationRec[]; seq: number } = {
  verifications: [],
  seq: 1,
};

async function ensureVerificationsTable() {
  if (!pool) return;
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS verifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      applicationId INT NOT NULL,
      surveyorId INT NOT NULL,
      type ENUM('home','document') NOT NULL,
      status ENUM('pending','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
      startLat DECIMAL(10,7) NULL,
      startLng DECIMAL(10,7) NULL,
      endLat DECIMAL(10,7) NULL,
      endLng DECIMAL(10,7) NULL,
      startTime DATETIME NULL,
      endTime DATETIME NULL,
      notes TEXT NULL,
      photos JSON NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

router.get(
  "/my",
  authenticateToken,
  authorize("surveyor", "admin"),
  async (req: AuthRequest, res) => {
    try {
      const surveyorId = req.user!.id;
      if (!pool) {
        const data = mem.verifications
          .filter((v) => v.surveyorId === surveyorId)
          .sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1));
        return res.json({ success: true, data });
      }
      await ensureVerificationsTable();
      const [rows] = await pool.execute(
        "SELECT * FROM verifications WHERE surveyorId = ? ORDER BY updatedAt DESC",
        [surveyorId],
      );
      res.json({ success: true, data: rows });
    } catch (e) {
      res
        .status(500)
        .json({
          success: false,
          error: e instanceof Error ? e.message : "Unknown error",
        });
    }
  },
);

router.post(
  "/start",
  authenticateToken,
  authorize("surveyor", "admin"),
  async (req: AuthRequest, res) => {
    try {
      const surveyorId = req.user!.id;
      const { applicationId, type, lat, lng, notes } = req.body as {
        applicationId: number;
        type: "home" | "document";
        lat?: number;
        lng?: number;
        notes?: string;
      };
      if (!applicationId || !type) {
        return res
          .status(400)
          .json({
            success: false,
            error: "applicationId and type are required",
          });
      }
      const now = new Date();
      if (!pool) {
        const rec: VerificationRec = {
          id: mem.seq++,
          applicationId,
          surveyorId,
          type,
          status: "in_progress",
          startLat: lat ?? null,
          startLng: lng ?? null,
          startTime: now.toISOString(),
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          endLat: null,
          endLng: null,
          endTime: null,
          notes: notes ?? null,
          photos: null,
        };
        mem.verifications.push(rec);
        return res
          .status(201)
          .json({ success: true, data: rec, message: "Verification started" });
      }
      await ensureVerificationsTable();
      const [result]: any = await pool.execute(
        `INSERT INTO verifications (applicationId, surveyorId, type, status, startLat, startLng, startTime, notes) VALUES (?,?,?,?,?,?,?,?)`,
        [
          applicationId,
          surveyorId,
          type,
          "in_progress",
          lat ?? null,
          lng ?? null,
          now,
          notes ?? null,
        ],
      );
      const [rows] = await pool.execute(
        "SELECT * FROM verifications WHERE id = ? LIMIT 1",
        [result.insertId],
      );
      res
        .status(201)
        .json({
          success: true,
          data: (rows as any[])[0],
          message: "Verification started",
        });
    } catch (e) {
      res
        .status(500)
        .json({
          success: false,
          error: e instanceof Error ? e.message : "Unknown error",
        });
    }
  },
);

router.post(
  "/complete",
  authenticateToken,
  authorize("surveyor", "admin"),
  async (req: AuthRequest, res) => {
    try {
      const surveyorId = req.user!.id;
      const { verificationId, lat, lng, notes } = req.body as {
        verificationId: number;
        lat?: number;
        lng?: number;
        notes?: string;
      };
      if (!verificationId) {
        return res
          .status(400)
          .json({ success: false, error: "verificationId is required" });
      }
      const now = new Date();
      if (!pool) {
        const idx = mem.verifications.findIndex(
          (v) => v.id === verificationId && v.surveyorId === surveyorId,
        );
        if (idx === -1)
          return res
            .status(404)
            .json({ success: false, error: "Verification not found" });
        const cur = mem.verifications[idx];
        const updated: VerificationRec = {
          ...cur,
          status: "completed",
          endLat: lat ?? null,
          endLng: lng ?? null,
          endTime: now.toISOString(),
          notes: notes ?? cur.notes ?? null,
          updatedAt: now.toISOString(),
        };
        mem.verifications[idx] = updated;
        return res.json({
          success: true,
          data: updated,
          message: "Verification completed",
        });
      }
      await ensureVerificationsTable();
      await pool.execute(
        `UPDATE verifications SET status = 'completed', endLat = ?, endLng = ?, endTime = ?, notes = COALESCE(?, notes) WHERE id = ? AND surveyorId = ?`,
        [
          lat ?? null,
          lng ?? null,
          now,
          notes ?? null,
          verificationId,
          surveyorId,
        ],
      );
      const [rows] = await pool.execute(
        "SELECT * FROM verifications WHERE id = ? LIMIT 1",
        [verificationId],
      );
      if (!(rows as any[])[0])
        return res
          .status(404)
          .json({ success: false, error: "Verification not found" });
      res.json({
        success: true,
        data: (rows as any[])[0],
        message: "Verification completed",
      });
    } catch (e) {
      res
        .status(500)
        .json({
          success: false,
          error: e instanceof Error ? e.message : "Unknown error",
        });
    }
  },
);

export default router;
