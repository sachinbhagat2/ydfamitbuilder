import { Router } from 'express';
import { authenticateToken, authorize } from '../utils/auth';
import { mockDatabase } from '../config/database';
import { ApiResponse, PaginatedResponse, Application } from '../../shared/types/database';

const router = Router();

// List applications with optional filters (admin only)
router.get('/', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, studentId, scholarshipId } = req.query as any;
    const result = await mockDatabase.getApplications({
      page: Number(page),
      limit: Number(limit),
      status: status as any,
      studentId: studentId ? Number(studentId) : undefined,
      scholarshipId: scholarshipId ? Number(scholarshipId) : undefined,
    });

    const response: PaginatedResponse<Application> = {
      success: true,
      data: result.data,
      pagination: result.pagination,
      message: 'Applications retrieved successfully',
    };
    res.json(response);
  } catch (error) {
    console.error('List applications error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Stats (admin only)
router.get('/stats', authenticateToken, authorize('admin'), async (_req, res) => {
  try {
    const stats = await mockDatabase.getApplicationStats();
    const response: ApiResponse = { success: true, data: stats, message: 'Stats retrieved successfully' };
    res.json(response);
  } catch (error) {
    console.error('Applications stats error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Recent applications (admin only)
router.get('/recent', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const limit = Number((req.query.limit as any) || 5);
    const recent = await mockDatabase.getRecentApplications(limit);
    const response: ApiResponse<Application[]> = { success: true, data: recent, message: 'Recent applications' };
    res.json(response);
  } catch (error) {
    console.error('Recent applications error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Export CSV (admin only)
router.get('/export', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.query as any;
    const all = await mockDatabase.getApplications({ page: 1, limit: 10000, status: status as any });
    const rows = all.data as any[];
    const headers = ['id','scholarshipId','studentId','status','score','amountAwarded','assignedReviewerId','submittedAt','updatedAt'];
    const csv = [headers.join(',')]
      .concat(
        rows.map(r => headers.map(h => {
          const v = r[h] != null ? r[h] : '';
          if (v instanceof Date) return new Date(v).toISOString();
          const s = String(v).replace(/"/g, '""');
          return /[",\n]/.test(s) ? `"${s}"` : s;
        }).join(','))
      )
      .join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="applications.csv"');
    res.send(csv);
  } catch (error) {
    console.error('Export applications error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
