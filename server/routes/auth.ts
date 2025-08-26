import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../config/database';
import { users } from '../schema';
import { 
  hashPassword, 
  comparePassword, 
  generateToken, 
  isValidEmail, 
  isValidPassword,
  authenticateToken,
  AuthRequest
} from '../utils/auth';
import { CreateUserInput, LoginInput, AuthResponse, ApiResponse } from '../../shared/types/database';

const router = Router();

// Create default users endpoint (for initial setup)
router.post('/create-default-users', async (req, res) => {
  try {
    const defaultUsers = [
      {
        email: 'student@ydf.org',
        password: 'Student123!',
        firstName: 'Demo',
        lastName: 'Student',
        phone: '+91 9876543210',
        userType: 'student' as const,
        profileData: { course: 'B.Tech Computer Science', college: 'Demo College' }
      },
      {
        email: 'admin@ydf.org',
        password: 'Admin123!',
        firstName: 'Demo',
        lastName: 'Admin',
        phone: '+91 9876543211',
        userType: 'admin' as const,
        profileData: { department: 'Administration' }
      },
      {
        email: 'reviewer@ydf.org',
        password: 'Reviewer123!',
        firstName: 'Demo',
        lastName: 'Reviewer',
        phone: '+91 9876543212',
        userType: 'reviewer' as const,
        profileData: { specialization: 'Academic Review' }
      },
      {
        email: 'donor@ydf.org',
        password: 'Donor123!',
        firstName: 'Demo',
        lastName: 'Donor',
        phone: '+91 9876543213',
        userType: 'donor' as const,
        profileData: { organization: 'Demo Foundation' }
      }
    ];

    const createdUsers = [];
    
    for (const userData of defaultUsers) {
      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.email, userData.email)).limit(1);
      
      if (existingUser.length === 0) {
        // Hash password and create user
        const hashedPassword = await hashPassword(userData.password);
        
        const newUser = await db.insert(users).values({
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          userType: userData.userType,
          profileData: userData.profileData,
          isActive: true,
          emailVerified: true
        }).returning();
        
        createdUsers.push({
          ...userData,
          id: newUser[0].id,
          password: userData.password // Return plain password for credentials
        });
      } else {
        createdUsers.push({
          ...userData,
          id: existingUser[0].id,
          exists: true
        });
      }
    }

    res.json({
      success: true,
      message: 'Default users created/verified successfully',
      users: createdUsers
    });
  } catch (error) {
    console.error('Create default users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create default users'
    });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, userType, profileData }: CreateUserInput = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !userType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Validate password strength
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        error: passwordValidation.message
      });
    }

    // Validate user type
    const validUserTypes = ['student', 'admin', 'reviewer', 'donor'];
    if (!validUserTypes.includes(userType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user type'
      });
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await db.insert(users).values({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      userType,
      profileData,
      isActive: true,
      emailVerified: false
    }).returning();

    if (newUser.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create user'
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser[0];

    // Generate token
    const token = generateToken(userWithoutPassword);

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        user: userWithoutPassword,
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      },
      message: 'User created successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password }: LoginInput = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (user.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const foundUser = user[0];

    // Check if user is active
    if (!foundUser.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated'
      });
    }

    // Compare password
    const isValidPassword = await comparePassword(password, foundUser.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
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
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      },
      message: 'Login successful'
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user[0];

    const response: ApiResponse = {
      success: true,
      data: userWithoutPassword,
      message: 'Profile retrieved successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const { firstName, lastName, phone, profileData } = req.body;

    // Update user
    const updatedUser = await db.update(users)
      .set({
        firstName,
        lastName,
        phone,
        profileData,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();

    if (updatedUser.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser[0];

    const response: ApiResponse = {
      success: true,
      data: userWithoutPassword,
      message: 'Profile updated successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Logout (client-side token removal, but we can log it server-side)
router.post('/logout', authenticateToken, async (req: AuthRequest, res) => {
  try {
    // In a more advanced setup, you might want to blacklist the token
    // For now, we'll just send a success response
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Verify token endpoint
router.get('/verify', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const response: ApiResponse = {
      success: true,
      data: req.user,
      message: 'Token is valid'
    };
    res.json(response);
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
