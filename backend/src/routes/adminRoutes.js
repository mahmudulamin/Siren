import express from 'express';
import {
  getDashboardStats,
  getAnalytics,
  getZonePredictions
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats retrieved successfully
 */
router.get('/stats', authenticate, authorize('official'), getDashboardStats);

/**
 * @swagger
 * /api/admin/analytics:
 *   get:
 *     summary: Get analytics data
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 1y]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
 */
router.get('/analytics', authenticate, authorize('official'), getAnalytics);

/**
 * @swagger
 * /api/admin/zones:
 *   get:
 *     summary: Get AI zone predictions
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Zone predictions retrieved successfully
 */
// Every authenticated emergency responder needs the same live risk layer.
router.get('/zones', authenticate, getZonePredictions);

export default router;
