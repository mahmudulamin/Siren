import express from 'express';
import {
  getAllVolunteers,
  getVolunteerById,
  updateVolunteer,
  createVolunteerProfile,
  getVolunteerStats,
  getMyVolunteerProfile,
  updateMyOperationalStatus
} from '../controllers/volunteerController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import {
  validateUpdateVolunteer,
  validateGetVolunteers,
  validateOperationalStatus,
  handleValidationErrors
} from '../validators/volunteerValidator.js';

const router = express.Router();

/**
 * @swagger
 * /api/volunteers:
 *   get:
 *     summary: Get all volunteers
 *     tags: [Volunteers]
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
 *         name: availability
 *         schema:
 *           type: boolean
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Volunteers retrieved successfully
 */
router.get('/', authenticate, authorize('official'), validateGetVolunteers, handleValidationErrors, getAllVolunteers);

/**
 * @swagger
 * /api/volunteers/profile:
 *   post:
 *     summary: Create volunteer profile
 *     tags: [Volunteers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skills:
 *                 type: array
 *               availability:
 *                 type: boolean
 *               location:
 *                 type: object
 *     responses:
 *       201:
 *         description: Volunteer profile created successfully
 */
router.post('/profile', authenticate, authorize('volunteer'), createVolunteerProfile);

router.get('/me', authenticate, authorize('volunteer'), getMyVolunteerProfile);
router.put(
  '/me/status',
  authenticate,
  authorize('volunteer'),
  validateOperationalStatus,
  handleValidationErrors,
  updateMyOperationalStatus
);

/**
 * @swagger
 * /api/volunteers/{id}:
 *   get:
 *     summary: Get volunteer by ID
 *     tags: [Volunteers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Volunteer retrieved successfully
 */
router.get('/:id', authenticate, authorize('official'), getVolunteerById);

/**
 * @swagger
 * /api/volunteers/{id}:
 *   put:
 *     summary: Update volunteer
 *     tags: [Volunteers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Volunteer updated successfully
 */
router.put('/:id', authenticate, authorize('volunteer', 'official'), validateUpdateVolunteer, handleValidationErrors, updateVolunteer);

/**
 * @swagger
 * /api/volunteers/{id}/stats:
 *   get:
 *     summary: Get volunteer statistics
 *     tags: [Volunteers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats retrieved successfully
 */
router.get('/:id/stats', authenticate, authorize('official'), getVolunteerStats);

export default router;
