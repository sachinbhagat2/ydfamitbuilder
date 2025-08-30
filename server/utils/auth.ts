import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../../shared/types/database';
import { mockDatabase } from '../config/database';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');

export interface AuthRequest extends Request {
  user?: Omit<User, 'password'> & { roles?: string[] };
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, BCRYPT_ROUNDS);
}

// Compare password
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Generate JWT token
export function generateToken(user: Omit<User, 'password'>): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      userType: user.userType,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Authentication middleware
export async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  try {
    const decoded = verifyToken(token) as any;
    const baseUser = { id: decoded.id, email: decoded.email, userType: decoded.userType } as any;
    try {
      const roles = await (mockDatabase as any).listUserRoles(decoded.id);
      req.user = { ...baseUser, roles: Array.isArray(roles) ? roles.map((r: any) => r.name) : [] } as any;
    } catch {
      req.user = baseUser as any;
    }
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
}

// Authorization middleware for specific roles (falls back to userType)
export function authorize(...required: string[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const userTypeOk = required.length === 0 || required.includes(req.user.userType);
    let roleOk = false;
    const userRoles = req.user.roles;

    if (Array.isArray(userRoles)) {
      roleOk = required.some((r) => userRoles.includes(r));
    } else {
      try {
        const roles = await (mockDatabase as any).listUserRoles(req.user.id as any);
        roleOk = required.some((r) => (roles || []).some((x: any) => x.name === r));
      } catch {
        roleOk = false;
      }
    }

    if (!(userTypeOk || roleOk)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }

    next();
  };
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  return { valid: true };
}

// Generate random string for password reset tokens
export function generateRandomString(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Extract user info from token (for client-side)
export function getUserFromToken(token: string): Omit<User, 'password'> | null {
  try {
    const decoded = verifyToken(token);
    return decoded;
  } catch (error) {
    return null;
  }
}
