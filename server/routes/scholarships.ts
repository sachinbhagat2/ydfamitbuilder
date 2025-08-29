import { Router } from "express";
import { mockDatabase } from "../config/database";
import { authenticateToken, authorize, AuthRequest } from "../utils/auth";
import {
  CreateScholarshipInput,
  Scholarship,
  ScholarshipQueryParams,
  ApiResponse,
  PaginatedResponse,
} from "../../shared/types/database";

const router = Router();

// Get all scholarships (public endpoint with optional filters)
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status = "active",
      category,
      minAmount,
      maxAmount,
      sortBy,
      sortOrder = "asc",
      deadlineBefore,
      deadlineAfter,
      tag,
    }: any = req.query as any;

    const allScholarships = await mockDatabase.getAllScholarships();
    let filtered = allScholarships;

    // Status filter
    if (status && status !== "all") {
      filtered = filtered.filter(
        (s: any) =>
          String(s.status || "").toLowerCase() === String(status).toLowerCase(),
      );
    }

    // Text search (title + description)
    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(
        (s: any) =>
          String(s.title || "")
            .toLowerCase()
            .includes(q) ||
          String(s.description || "")
            .toLowerCase()
            .includes(q),
      );
    }

    // Category/Tag filter (match any tag)
    const cat = (category || tag) as string | undefined;
    if (cat && String(cat).toLowerCase() !== "all") {
      filtered = filtered.filter((s: any) =>
        Array.isArray(s.tags)
          ? s.tags.some(
              (t: any) => String(t).toLowerCase() === String(cat).toLowerCase(),
            )
          : false,
      );
    }

    // Amount range
    const minA = minAmount != null ? Number(minAmount) : undefined;
    const maxA = maxAmount != null ? Number(maxAmount) : undefined;
    if (minA != null || maxA != null) {
      filtered = filtered.filter((s: any) => {
        const amt = Number(s.amount || 0);
        if (Number.isNaN(amt)) return false;
        if (minA != null && amt < minA) return false;
        if (maxA != null && amt > maxA) return false;
        return true;
      });
    }

    // Deadline range
    const before = deadlineBefore ? new Date(deadlineBefore as any) : undefined;
    const after = deadlineAfter ? new Date(deadlineAfter as any) : undefined;
    if (before || after) {
      filtered = filtered.filter((s: any) => {
        const d = s.applicationDeadline
          ? new Date(s.applicationDeadline)
          : null;
        if (!d) return false;
        if (after && d < after) return false;
        if (before && d > before) return false;
        return true;
      });
    }

    // Sorting
    if (sortBy) {
      const sb = String(sortBy).toLowerCase();
      const so = String(sortOrder || "asc").toLowerCase() === "desc" ? -1 : 1;
      filtered = [...filtered].sort((a: any, b: any) => {
        if (sb === "deadline") {
          const da = a.applicationDeadline
            ? new Date(a.applicationDeadline).getTime()
            : Infinity;
          const db = b.applicationDeadline
            ? new Date(b.applicationDeadline).getTime()
            : Infinity;
          return (da - db) * so;
        }
        if (sb === "amount") {
          const aa = Number(a.amount || 0) || 0;
          const bb = Number(b.amount || 0) || 0;
          return (aa - bb) * so;
        }
        if (sb === "applications" || sb === "applicants") {
          const aa = Number(a.currentApplications || 0) || 0;
          const bb = Number(b.currentApplications || 0) || 0;
          return (aa - bb) * so;
        }
        return 0;
      });
    }

    const offset = (Number(page) - 1) * Number(limit);
    const list = filtered.slice(offset, offset + Number(limit));

    const response: PaginatedResponse<Scholarship> = {
      success: true,
      data: list as any,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / Number(limit)),
      },
      message: "Scholarships retrieved successfully",
    };

    res.json(response);
  } catch (error) {
    console.error("Get scholarships error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Get scholarship by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const scholarship = await mockDatabase.getScholarshipById(Number(id));
    if (!scholarship)
      return res
        .status(404)
        .json({ success: false, error: "Scholarship not found" });
    const response: ApiResponse<Scholarship> = {
      success: true,
      data: scholarship,
      message: "Scholarship retrieved successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Get scholarship error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Create new scholarship (admin only)
router.post(
  "/",
  authenticateToken,
  authorize("admin"),
  async (req: AuthRequest, res) => {
    try {
      const {
        title,
        description,
        amount,
        currency = "INR",
        eligibilityCriteria,
        requiredDocuments,
        applicationDeadline,
        selectionDeadline,
        maxApplications,
        tags,
      }: any = req.body;

      if (
        !title ||
        !description ||
        !amount ||
        !eligibilityCriteria ||
        !requiredDocuments ||
        !applicationDeadline
      ) {
        return res
          .status(400)
          .json({ success: false, error: "Missing required fields" });
      }

      const deadline = new Date(applicationDeadline);
      if (deadline <= new Date()) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Application deadline must be in the future",
          });
      }

      const created = await mockDatabase.createScholarship(
        {
          title,
          description,
          amount,
          currency,
          eligibilityCriteria,
          requiredDocuments,
          applicationDeadline: deadline,
          selectionDeadline: selectionDeadline
            ? new Date(selectionDeadline)
            : null,
          maxApplications: maxApplications ?? null,
          tags: tags ?? null,
          status: "active",
        },
        req.user?.id,
      );

      const response: ApiResponse<Scholarship> = {
        success: true,
        data: created,
        message: "Scholarship created successfully",
      };
      res.status(201).json(response);
    } catch (error) {
      console.error("Create scholarship error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  },
);

// Update scholarship (admin only)
router.put(
  "/:id",
  authenticateToken,
  authorize("admin"),
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body || {};
      delete updateData.id;
      delete updateData.createdAt;
      delete updateData.createdBy;
      delete updateData.currentApplications;

      const updated = await mockDatabase.updateScholarship(
        Number(id),
        updateData,
      );
      if (!updated)
        return res
          .status(404)
          .json({ success: false, error: "Scholarship not found" });

      const response: ApiResponse<Scholarship> = {
        success: true,
        data: updated,
        message: "Scholarship updated successfully",
      };
      res.json(response);
    } catch (error) {
      console.error("Update scholarship error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  },
);

// Delete scholarship (admin only)
router.delete(
  "/:id",
  authenticateToken,
  authorize("admin"),
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const ok = await mockDatabase.deleteScholarship(Number(id));
      if (!ok)
        return res
          .status(404)
          .json({ success: false, error: "Scholarship not found" });
      res.json({ success: true, message: "Scholarship deleted successfully" });
    } catch (error) {
      console.error("Delete scholarship error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  },
);

export default router;
