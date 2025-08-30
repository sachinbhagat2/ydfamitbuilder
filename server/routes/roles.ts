import { Router } from "express";
import { authenticateToken, authorize, AuthRequest } from "../utils/auth";
import { mockDatabase } from "../config/database";

const router = Router();

// List roles
router.get("/", authenticateToken, authorize("admin"), async (req, res) => {
  try {
    const roles = await (mockDatabase as any).listRoles();
    res.json({ success: true, data: roles });
  } catch (e: any) {
    res
      .status(500)
      .json({ success: false, error: e?.message || "Failed to list roles" });
  }
});

// Create role
router.post("/", authenticateToken, authorize("admin"), async (req, res) => {
  try {
    const { name, description, permissions } = req.body || {};
    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "name is required" });
    }
    const role = await (mockDatabase as any).createRole({
      name: name.trim(),
      description: description ?? null,
      permissions: permissions ?? null,
    });
    res.status(201).json({ success: true, data: role });
  } catch (e: any) {
    res
      .status(500)
      .json({ success: false, error: e?.message || "Failed to create role" });
  }
});

// Update role
router.put("/:id", authenticateToken, authorize("admin"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description, permissions } = req.body || {};
    if (!Number.isFinite(id))
      return res.status(400).json({ success: false, error: "invalid id" });
    const updated = await (mockDatabase as any).updateRole(id, {
      name,
      description,
      permissions,
    });
    res.json({ success: true, data: updated });
  } catch (e: any) {
    res
      .status(500)
      .json({ success: false, error: e?.message || "Failed to update role" });
  }
});

// Delete role
router.delete(
  "/:id",
  authenticateToken,
  authorize("admin"),
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id))
        return res.status(400).json({ success: false, error: "invalid id" });
      const ok = await (mockDatabase as any).deleteRole(id);
      if (!ok)
        return res
          .status(400)
          .json({
            success: false,
            error: "Cannot delete system role or role not found",
          });
      res.json({ success: true });
    } catch (e: any) {
      res
        .status(500)
        .json({ success: false, error: e?.message || "Failed to delete role" });
    }
  },
);

// List roles for a user
router.get(
  "/user/:userId",
  authenticateToken,
  authorize("admin"),
  async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      if (!Number.isFinite(userId))
        return res
          .status(400)
          .json({ success: false, error: "invalid userId" });
      const roles = await (mockDatabase as any).listUserRoles(userId);
      res.json({ success: true, data: roles });
    } catch (e: any) {
      res
        .status(500)
        .json({
          success: false,
          error: e?.message || "Failed to list user roles",
        });
    }
  },
);

// Assign role
router.post(
  "/assign",
  authenticateToken,
  authorize("admin"),
  async (req, res) => {
    try {
      const { userId, roleId } = req.body || {};
      if (!Number.isFinite(userId) || !Number.isFinite(roleId))
        return res
          .status(400)
          .json({ success: false, error: "userId and roleId required" });
      await (mockDatabase as any).assignRoleToUser(
        Number(userId),
        Number(roleId),
      );
      res.json({ success: true });
    } catch (e: any) {
      res
        .status(500)
        .json({ success: false, error: e?.message || "Failed to assign role" });
    }
  },
);

// Remove role from user
router.post(
  "/remove",
  authenticateToken,
  authorize("admin"),
  async (req, res) => {
    try {
      const { userId, roleId } = req.body || {};
      if (!Number.isFinite(userId) || !Number.isFinite(roleId))
        return res
          .status(400)
          .json({ success: false, error: "userId and roleId required" });
      await (mockDatabase as any).removeRoleFromUser(
        Number(userId),
        Number(roleId),
      );
      res.json({ success: true });
    } catch (e: any) {
      res
        .status(500)
        .json({ success: false, error: e?.message || "Failed to remove role" });
    }
  },
);

export default router;
