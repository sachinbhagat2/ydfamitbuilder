import { Router } from 'express';
import { mockDatabase } from '../config/database';
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

    // Get scholarships from mock database
    const allScholarships = await mockDatabase.getAllScholarships();
    
    // Apply filters
    let filteredScholarships = allScholarships;
    
    if (status && status !== 'all') {
      filteredScholarships = filteredScholarships.filter(s => s.status === status);
    }
    
    if (search) {
      filteredScholarships = filteredScholarships.filter(s => 
        s.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Pagination
    const offset = (Number(page) - 1) * Number(limit);
    const scholarshipList = filteredScholarships.slice(offset, offset + Number(limit));
    const totalCount = filteredScholarships.length;
    const totalPages = Math.ceil(totalCount / Number(limit));

    const response: PaginatedResponse<Scholarship> = {
      success: true,
      data: scholarshipList,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount,
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

    const scholarship = await mockDatabase.getScholarshipById(Number(id));

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        error: 'Scholarship not found'
      });
    }

    const response: ApiResponse<Scholarship> = {
      success: true,
      data: scholarship,
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
