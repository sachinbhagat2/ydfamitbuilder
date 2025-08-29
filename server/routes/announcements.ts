import { Router } from "express";
import { mockDatabase } from "../config/database";
import { ApiResponse } from "../../shared/types/database";

const router = Router();

// Public: list latest active announcements
router.get("/", async (req, res) => {
  try {
    const limit = Number((req.query.limit as any) || 5);
    const list = await mockDatabase.getAnnouncements({ limit, activeOnly: true });
    const response: ApiResponse<any[]> = {
      success: true,
      data: list,
      message: "Announcements retrieved successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("List announcements error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Public: get announcement by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params as any;
    const item = await mockDatabase.getAnnouncementById(Number(id));
    if (!item) return res.status(404).json({ success: false, error: "Not found" });
    const response: ApiResponse<any> = {
      success: true,
      data: item,
      message: "Announcement retrieved successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Get announcement error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
