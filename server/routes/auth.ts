import { Router } from "express";
import { mockDatabase } from "../config/database";
import {
  hashPassword,
  comparePassword,
  generateToken,
  isValidEmail,
  isValidPassword,
  authenticateToken,
  authorize,
  AuthRequest,
} from "../utils/auth";
import {
  CreateUserInput,
  LoginInput,
  AuthResponse,
  ApiResponse,
} from "../../shared/types/database";

const router = Router();

// Create default users endpoint (for initial setup)
router.post("/create-default-users", async (req, res) => {
  try {
    const defaultUsers = [
      {
        email: "student@ydf.org",
        password: "Student123!",
        firstName: "Demo",
        lastName: "Student",
        phone: "+91 9876543210",
        userType: "student" as const,
        profileData: {
          course: "B.Tech Computer Science",
          college: "Demo College",
        },
      },
      {
        email: "admin@ydf.org",
        password: "Admin123!",
        firstName: "Demo",
        lastName: "Admin",
        phone: "+91 9876543211",
        userType: "admin" as const,
        profileData: { department: "Administration" },
      },
      {
        email: "reviewer@ydf.org",
        password: "Reviewer123!",
        firstName: "Demo",
        lastName: "Reviewer",
        phone: "+91 9876543212",
        userType: "reviewer" as const,
        profileData: { specialization: "Academic Review" },
      },
      {
        email: "donor@ydf.org",
        password: "Donor123!",
        firstName: "Demo",
        lastName: "Donor",
        phone: "+91 9876543213",
        userType: "donor" as const,
        profileData: { organization: "Demo Foundation" },
      },
      {
        email: "surveyor@ydf.org",
        password: "Surveyor123!",
        firstName: "Demo",
        lastName: "Surveyor",
        phone: "+91 9876543214",
        userType: "surveyor" as const,
        profileData: { department: "Field Verification" },
      },
    ];

    const createdUsers = [];

    for (const userData of defaultUsers) {
      const existingUser = await mockDatabase.findUserByEmail(userData.email);
      if (!existingUser) {
        const hashedPassword = await hashPassword(userData.password);
        const newUser = await mockDatabase.createUser({
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          userType: userData.userType,
          profileData: userData.profileData,
          isActive: true,
          emailVerified: true,
        });
        createdUsers.push({
          ...userData,
          id: newUser.id,
          password: userData.password,
        });
      } else {
        const toUpdate: any = {};
        if (existingUser.userType !== userData.userType)
          toUpdate.userType = userData.userType;
        if (existingUser.isActive !== true) toUpdate.isActive = true;
        if (existingUser.emailVerified !== true) toUpdate.emailVerified = true;
        if (Object.keys(toUpdate).length) {
          await mockDatabase.updateUser(existingUser.id, toUpdate);
        }
        createdUsers.push({ ...userData, id: existingUser.id, exists: true });
      }
    }

    res.json({
      success: true,
      message: "Default users created/verified successfully",
      users: createdUsers,
    });
  } catch (error) {
    console.error("Create default users error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create default users",
    });
  }
});

// Register new user
router.post("/register", async (req, res) => {
  try {
    const {
      email: inputEmail,
      password,
      firstName,
      lastName,
      phone,
      userType,
      profileData,
    }: CreateUserInput = req.body;

    const email = String(inputEmail || "")
      .trim()
      .toLowerCase();

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !userType) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    // Validate password strength
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        error: passwordValidation.message,
      });
    }

    // Validate user type
    const validUserTypes = [
      "student",
      "admin",
      "reviewer",
      "donor",
      "surveyor",
    ];
    if (!validUserTypes.includes(userType)) {
      return res.status(400).json({
        success: false,
        error: "Invalid user type",
      });
    }

    // Check if user already exists in mock database
    const existingUser = await mockDatabase.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user in mock database
    const newUser = await mockDatabase.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      userType,
      profileData,
      isActive: true,
      emailVerified: false,
    });

    // Assign role based on selected userType
    try {
      const roles = await (mockDatabase as any).listRoles();
      const match = (roles || []).find((r: any) => String(r.name) === String(userType));
      if (match) {
        await (mockDatabase as any).assignRoleToUser(newUser.id, match.id);
      }
    } catch {}

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    // Generate token
    const token = generateToken(userWithoutPassword);

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        user: userWithoutPassword,
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      },
      message: "User created successfully",
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email: inputEmail, password }: LoginInput = req.body;
    const email = String(inputEmail || "")
      .trim()
      .toLowerCase();

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    // Find user by email in mock database
    const user = await mockDatabase.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    const foundUser = user;

    // Check if user is active
    if (!foundUser.isActive) {
      return res.status(401).json({
        success: false,
        error: "Account is deactivated",
      });
    }

    // Compare password
    const isValidPassword = await comparePassword(password, foundUser.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = foundUser;

    // Generate token
    const token = generateToken(userWithoutPassword);

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        user: userWithoutPassword,
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      },
      message: "Login successful",
    };

    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Get current user profile
router.get("/profile", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    const user = await mockDatabase.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    const response: ApiResponse = {
      success: true,
      data: userWithoutPassword,
      message: "Profile retrieved successfully",
    };

    res.json(response);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Update user profile
router.put("/profile", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    const { firstName, lastName, phone, profileData } = req.body;

    // Update user in mock database
    const updatedUser = await mockDatabase.updateUser(userId, {
      firstName,
      lastName,
      phone,
      profileData,
      updatedAt: new Date(),
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    const response: ApiResponse = {
      success: true,
      data: userWithoutPassword,
      message: "Profile updated successfully",
    };

    res.json(response);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Change password
router.post(
  "/change-password",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, error: "User not authenticated" });
      }
      const { currentPassword, newPassword } = req.body || {};
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: "currentPassword and newPassword are required",
        });
      }
      const validation = isValidPassword(newPassword);
      if (!validation.valid) {
        return res
          .status(400)
          .json({ success: false, error: validation.message });
      }
      const user = await mockDatabase.findUserById(userId);
      if (!user)
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      const ok = await comparePassword(currentPassword, user.password);
      if (!ok)
        return res
          .status(401)
          .json({ success: false, error: "Current password is incorrect" });
      const hashed = await hashPassword(newPassword);
      await mockDatabase.updateUser(userId, {
        password: hashed,
        updatedAt: new Date(),
      });
      return res.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  },
);

// Logout (client-side token removal, but we can log it server-side)
router.post("/logout", authenticateToken, async (req: AuthRequest, res) => {
  try {
    // In a more advanced setup, you might want to blacklist the token
    // For now, we'll just send a success response
    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Profile documents - list
router.get(
  "/profile/documents",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user?.id;
      if (!userId)
        return res
          .status(401)
          .json({ success: false, error: "User not authenticated" });
      const user = await mockDatabase.findUserById(userId);
      if (!user)
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      const docs = Array.isArray(user.profileData?.documents)
        ? user.profileData.documents
        : [];
      return res.json({
        success: true,
        data: docs,
        message: "Documents retrieved",
      });
    } catch (e) {
      console.error("List documents error:", e);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  },
);

// Upload document (base64 content)
router.post(
  "/profile/documents",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user?.id;
      if (!userId)
        return res
          .status(401)
          .json({ success: false, error: "User not authenticated" });
      const { name, size, type, content } = req.body || {};
      if (!name || !content)
        return res
          .status(400)
          .json({ success: false, error: "name and content are required" });
      const user = await mockDatabase.findUserById(userId);
      if (!user)
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      const docs = Array.isArray(user.profileData?.documents)
        ? user.profileData.documents
        : [];
      const id = docs.length
        ? Math.max(...docs.map((d: any) => Number(d.id) || 0)) + 1
        : 1;
      const doc = {
        id,
        name,
        size: size ?? null,
        type: type ?? "application/octet-stream",
        uploadDate: new Date().toISOString().slice(0, 10),
        status: "Pending",
        content,
      };
      const nextProfile = {
        ...(user.profileData || {}),
        documents: [...docs, doc],
      };
      const updated = await mockDatabase.updateUser(userId, {
        profileData: nextProfile,
      });
      return res
        .status(201)
        .json({ success: true, data: doc, message: "Uploaded" });
    } catch (e) {
      console.error("Upload document error:", e);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  },
);

// Delete document
router.delete(
  "/profile/documents/:id",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user?.id;
      if (!userId)
        return res
          .status(401)
          .json({ success: false, error: "User not authenticated" });
      const id = Number(req.params.id);
      const user = await mockDatabase.findUserById(userId);
      if (!user)
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      const docs = Array.isArray(user.profileData?.documents)
        ? user.profileData.documents
        : [];
      const next = docs.filter((d: any) => Number(d.id) !== id);
      const updated = await mockDatabase.updateUser(userId, {
        profileData: { ...(user.profileData || {}), documents: next },
      });
      return res.json({ success: true, message: "Deleted" });
    } catch (e) {
      console.error("Delete document error:", e);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  },
);

// Download document
router.get(
  "/profile/documents/:id/download",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user?.id;
      if (!userId)
        return res
          .status(401)
          .json({ success: false, error: "User not authenticated" });
      const id = Number(req.params.id);
      const user = await mockDatabase.findUserById(userId);
      if (!user)
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      const docs = Array.isArray(user.profileData?.documents)
        ? user.profileData.documents
        : [];
      const doc = docs.find((d: any) => Number(d.id) === id);
      if (!doc)
        return res
          .status(404)
          .json({ success: false, error: "Document not found" });
      const base64 = String(doc.content || "");
      const buffer = Buffer.from(base64.split(",").pop() || "", "base64");
      res.setHeader("Content-Type", doc.type || "application/octet-stream");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${doc.name}"`,
      );
      return res.end(buffer);
    } catch (e) {
      console.error("Download document error:", e);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  },
);

// Verify token endpoint
router.get("/verify", authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, error: "User not authenticated" });
    }
    const dbUser = await mockDatabase.findUserById(req.user.id);
    if (!dbUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    const roles = await (mockDatabase as any).listUserRoles(req.user.id);
    const roleNames = Array.isArray(roles) ? roles.map((r: any) => r.name) : [];
    const { password: _pw, ...userWithoutPassword } = dbUser as any;
    const response: ApiResponse = {
      success: true,
      data: { ...userWithoutPassword, roles: roleNames },
      message: "Token is valid",
    };
    res.json(response);
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Admin: list users (filter by userType)
router.get(
  "/users",
  authenticateToken,
  authorize("admin"),
  async (req, res) => {
    try {
      const {
        userType,
        search,
        isActive,
        page = 1,
        limit = 100,
      } = req.query as any;
      const result = await (mockDatabase as any).listUsers({
        userType,
        search,
        isActive:
          typeof isActive === "string"
            ? isActive.toLowerCase() === "true"
            : undefined,
        page: Number(page),
        limit: Number(limit),
      });
      return res.json({ success: true, data: result });
    } catch (error) {
      console.error("List users error:", error);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  },
);

// Admin: update user active status
router.patch(
  "/users/:id",
  authenticateToken,
  authorize("admin"),
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { isActive } = req.body || {};
      if (!Number.isFinite(id)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid user id" });
      }
      if (typeof isActive !== "boolean") {
        return res
          .status(400)
          .json({ success: false, error: "isActive boolean is required" });
      }
      const updated = await (mockDatabase as any).updateUser(id, {
        isActive,
        updatedAt: new Date(),
      });
      if (!updated) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }
      const { password: _pw, ...userWithoutPassword } = updated;
      return res.json({ success: true, data: userWithoutPassword });
    } catch (error) {
      console.error("Update user status error:", error);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  },
);

export default router;
