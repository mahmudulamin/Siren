import express from 'express';
import {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  assignVolunteer
} from '../controllers/requestController.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import {
  validateCreateRequest,
  validateUpdateRequest,
  validateGetRequests,
  handleValidationErrors
} from '../validators/requestValidator.js';

const router = express.Router();

/**
 * @swagger
 * /api/requests:
 *   get:
 *     summary: Get all emergency requests
 *     tags: [Requests]
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
 *         name: severity
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Requests retrieved successfully
 */
router.get('/', authenticate, validateGetRequests, handleValidationErrors, getAllRequests);

/**
 * @swagger
 * /api/requests:
 *   post:
 *     summary: Create a new emergency request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               victimName:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               coordinates:
 *                 type: object
 *               emergencyType:
 *                 type: string
 *               description:
 *                 type: string
 *               severity:
 *                 type: string
 *     responses:
 *       201:
 *         description: Request created successfully
 */
router.post('/', optionalAuthenticate, apiLimiter, validateCreateRequest, handleValidationErrors, createRequest);

/**
 * @swagger
 * /api/requests/{id}:
 *   get:
 *     summary: Get request by ID
 *     tags: [Requests]
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
 *         description: Request retrieved successfully
 *       404:
 *         description: Request not found
 */
router.get('/:id', authenticate, getRequestById);

/**
 * @swagger
 * /api/requests/{id}:
 *   put:
 *     summary: Update a request
 *     tags: [Requests]
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
 *         description: Request updated successfully
 */
router.put('/:id', authenticate, authorize('official', 'volunteer'), validateUpdateRequest, handleValidationErrors, updateRequest);

/**
 * @swagger
 * /api/requests/{id}:
 *   delete:
 *     summary: Delete a request
 *     tags: [Requests]
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
 *         description: Request deleted successfully
 */
router.delete('/:id', authenticate, authorize('official', 'victim'), deleteRequest);

/**
 * @swagger
 * /api/requests/{id}/assign:
 *   post:
 *     summary: Assign volunteer to request
 *     tags: [Requests]
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
 *         description: Volunteer assigned successfully
 */
router.post('/:id/assign', authenticate, authorize('official'), assignVolunteer);

export default router;
