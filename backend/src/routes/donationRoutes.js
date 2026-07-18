import express from 'express';
import {
  createDonation,
  getAllDonations,
  getUserDonations,
  getDonationStats,
  updateDonationStatus,
  getDonationsByCategory
} from '../controllers/donationController.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import {
  validateCreateDonation,
  validateGetDonations,
  handleValidationErrors
} from '../validators/donationValidator.js';

const router = express.Router();

/**
 * @swagger
 * /api/donations:
 *   get:
 *     summary: Get all donations (public donations only)
 *     tags: [Donations]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Donations retrieved successfully
 */
router.get('/', optionalAuthenticate, validateGetDonations, handleValidationErrors, getAllDonations);

/**
 * @swagger
 * /api/donations:
 *   post:
 *     summary: Create a new donation
 *     tags: [Donations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               donorName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [money, supply]
 *               category:
 *                 type: string
 *               amount:
 *                 type: number
 *               items:
 *                 type: array
 *     responses:
 *       201:
 *         description: Donation created successfully
 */
router.post('/', authenticate, authorize('donor', 'official'), apiLimiter, validateCreateDonation, handleValidationErrors, createDonation);

/**
 * @swagger
 * /api/donations/user:
 *   get:
 *     summary: Get user's donations
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User donations retrieved successfully
 */
router.get('/user/history', authenticate, getUserDonations);

/**
 * @swagger
 * /api/donations/stats:
 *   get:
 *     summary: Get donation statistics
 *     tags: [Donations]
 *     responses:
 *       200:
 *         description: Stats retrieved successfully
 */
router.get('/stats/overview', getDonationStats);

/**
 * @swagger
 * /api/donations/category:
 *   get:
 *     summary: Get donations by category
 *     tags: [Donations]
 *     responses:
 *       200:
 *         description: Donations by category retrieved successfully
 */
router.get('/category/breakdown', getDonationsByCategory);

/**
 * @swagger
 * /api/donations/{id}/status:
 *   put:
 *     summary: Update donation status
 *     tags: [Donations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.put('/:id/status', authenticate, authorize('official'), updateDonationStatus);

export default router;
