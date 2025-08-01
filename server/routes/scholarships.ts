import { Router } from 'express';
import { eq, desc, and, gte, lte, like, count } from 'drizzle-orm';
import { db } from '../config/database';
import { scholarships, applications } from '../schema';
import { authenticateToken, authorize, AuthRequest } from '../utils/auth';
import { 
  CreateScholarshipInput, 
  Scholarship, 
  ScholarshipQueryParams, 
  ApiResponse, 
  PaginatedResponse 
} from '../../shared/types/database';

const router = Router();

// Get all scholarships (public endpoint with optional filters)
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      status = 'active',
      category,
      minAmount,
      maxAmount
    }: ScholarshipQueryParams = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    // Build query conditions
    const conditions = [];
    
    if (status) {
      conditions.push(eq(scholarships.status, status));
    }
    
    if (search) {
      conditions.push(like(scholarships.title, `%${search}%`));
    }
    
    if (minAmount) {
      conditions.push(gte(scholarships.amount, minAmount.toString()));
    }
    
    if (maxAmount) {
      conditions.push(lte(scholarships.amount, maxAmount.toString()));
    }

    // Get scholarships with pagination
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const [scholarshipList, totalCount] = await Promise.all([
      db.select()
        .from(scholarships)
        .where(whereClause)
        .orderBy(sortOrder === 'desc' ? desc(scholarships[sortBy as keyof typeof scholarships]) : scholarships[sortBy as keyof typeof scholarships])
        .limit(Number(limit))
        .offset(offset),
      db.select({ count: count() })
        .from(scholarships)
        .where(whereClause)
    ]);

    const totalPages = Math.ceil(totalCount[0].count / Number(limit));

    const response: PaginatedResponse<Scholarship> = {
      success: true,
      data: scholarshipList,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount[0].count,
        totalPages
      },
      message: 'Scholarships retrieved successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Get scholarships error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get scholarship by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const scholarship = await db.select()
      .from(scholarships)
      .where(eq(scholarships.id, Number(id)))
      .limit(1);

    if (scholarship.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Scholarship not found'
      });
    }

    const response: ApiResponse<Scholarship> = {
      success: true,
      data: scholarship[0],
      message: 'Scholarship retrieved successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Get scholarship error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Create new scholarship (admin only)
router.post('/', authenticateToken, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const {
      title,
      description,
      amount,
      currency = 'INR',
      eligibilityCriteria,
      requiredDocuments,
      applicationDeadline,
      selectionDeadline,
      maxApplications,
      tags
    }: CreateScholarshipInput = req.body;

    // Validate required fields
    if (!title || !description || !amount || !eligibilityCriteria || !requiredDocuments || !applicationDeadline) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Validate deadline is in the future
    const deadline = new Date(applicationDeadline);
    if (deadline <= new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Application deadline must be in the future'
      });
    }

    const newScholarship = await db.insert(scholarships).values({
      title,
      description,
      amount,
      currency,
      eligibilityCriteria,
      requiredDocuments,
      applicationDeadline: deadline,
      selectionDeadline: selectionDeadline ? new Date(selectionDeadline) : undefined,
      maxApplications,
      currentApplications: 0,
      status: 'active',
      createdBy: req.user?.id,
      tags
    }).returning();

    const response: ApiResponse<Scholarship> = {
      success: true,
      data: newScholarship[0],
      message: 'Scholarship created successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Create scholarship error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update scholarship (admin only)
router.put('/:id', authenticateToken, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.createdBy;
    delete updateData.currentApplications;

    const updatedScholarship = await db.update(scholarships)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(scholarships.id, Number(id)))
      .returning();

    if (updatedScholarship.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Scholarship not found'
      });
    }

    const response: ApiResponse<Scholarship> = {
      success: true,
      data: updatedScholarship[0],
      message: 'Scholarship updated successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Update scholarship error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Delete scholarship (admin only)
router.delete('/:id', authenticateToken, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Check if scholarship has applications
    const existingApplications = await db.select()
      .from(applications)
      .where(eq(applications.scholarshipId, Number(id)))
      .limit(1);

    if (existingApplications.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete scholarship with existing applications'
      });
    }

    const deletedScholarship = await db.delete(scholarships)
      .where(eq(scholarships.id, Number(id)))
      .returning();

    if (deletedScholarship.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Scholarship not found'
      });
    }

    const response: ApiResponse = {
      success: true,
      message: 'Scholarship deleted successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Delete scholarship error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get scholarship statistics (admin only)
router.get('/:id/stats', authenticateToken, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Get scholarship details
    const scholarship = await db.select()
      .from(scholarships)
      .where(eq(scholarships.id, Number(id)))
      .limit(1);

    if (scholarship.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Scholarship not found'
      });
    }

    // Get application statistics
    const applicationStats = await db.select({
      total: count(),
      status: applications.status
    })
    .from(applications)
    .where(eq(applications.scholarshipId, Number(id)))
    .groupBy(applications.status);

    const stats = {
      scholarship: scholarship[0],
      applications: {
        total: applicationStats.reduce((sum, stat) => sum + stat.total, 0),
        byStatus: applicationStats.reduce((acc, stat) => {
          acc[stat.status] = stat.total;
          return acc;
        }, {} as Record<string, number>)
      }
    };

    const response: ApiResponse = {
      success: true,
      data: stats,
      message: 'Scholarship statistics retrieved successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Get scholarship stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
