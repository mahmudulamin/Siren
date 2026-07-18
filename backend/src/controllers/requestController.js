import Request from '../models/Request.js';
import Volunteer from '../models/Volunteer.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

export const createRequest = async (req, res, next) => {
  try {
    const {
      victimName,
      phone,
      email,
      address,
      coordinates,
      emergencyType,
      description,
      severity,
      photoUrl,
      clientRequestId,
      locationSource
    } = req.body;

    const hasCoordinates = coordinates?.lat !== null && coordinates?.lat !== undefined &&
      coordinates?.lng !== null && coordinates?.lng !== undefined &&
      Number.isFinite(Number(coordinates.lat)) && Number.isFinite(Number(coordinates.lng));
    const requestData = {
      victimName,
      phone,
      email: email || undefined,
      address,
      coordinates: hasCoordinates ? coordinates : undefined,
      emergencyType,
      description,
      severity,
      photoUrl: photoUrl || null,
      clientRequestId: clientRequestId || undefined,
      locationSource: hasCoordinates ? (locationSource || 'gps') : 'address',
      victimId: req.user?._id || undefined
    };

    let request;

    if (clientRequestId) {
      request = await Request.findOneAndUpdate(
        { clientRequestId },
        { $setOnInsert: requestData },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
      );
    } else {
      request = new Request(requestData);
      await request.save();
    }

    logger.info('Emergency request created', {
      requestId: request._id,
      severity,
      userId: req.user?._id || null,
      clientRequestId: clientRequestId || null
    });

    const response = new ApiResponse(201, request, 'Request created successfully');
    res.status(201).json(response.toJSON());
  } catch (error) {
    // A victim and a relay responder may reconnect at the same time. The
    // shared clientRequestId makes the report idempotent; return the existing
    // report instead of leaving one device stuck on a duplicate-key error.
    if (error?.code === 11000 && req.body.clientRequestId) {
      const existingRequest = await Request.findOne({ clientRequestId: req.body.clientRequestId });
      if (existingRequest) {
        const response = new ApiResponse(200, existingRequest, 'Emergency request already synchronized');
        return res.status(200).json(response.toJSON());
      }
    }
    next(error);
  }
};

export const getAllRequests = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      severity,
      emergencyType,
      search
    } = req.query;

    // Build filter
    const filter = {};

    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    if (emergencyType) filter.emergencyType = emergencyType;

    if (search) {
      filter.$or = [
        { victimName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [requests, total] = await Promise.all([
      Request.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Request.countDocuments(filter)
    ]);

    const response = new ApiResponse(200, {
      requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'Requests retrieved successfully');

    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

export const getRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const request = await Request.findById(id);

    if (!request) {
      throw ApiError.notFound('Request not found');
    }

    const response = new ApiResponse(200, request, 'Request retrieved successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

export const updateRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const request = await Request.findById(id);

    if (!request) {
      throw ApiError.notFound('Request not found');
    }

    const previousStatus = request.status;

    if (req.user.role === 'volunteer') {
      const volunteer = await Volunteer.findOne({ userId: req.user._id });
      const isAssigned = volunteer &&
        String(request.assignedVolunteer?.volunteerId) === String(volunteer._id);

      if (!isAssigned) {
        throw ApiError.forbidden('You can only update a request assigned to you');
      }

      if (!['in_progress', 'completed'].includes(updates.status)) {
        throw ApiError.badRequest('Volunteer status must be in progress or completed');
      }

      request.status = updates.status;

      if (updates.status === 'in_progress') {
        volunteer.operationalStatus = 'on_scene';
        volunteer.availability = false;
      } else if (updates.status === 'completed') {
        volunteer.operationalStatus = 'available';
        volunteer.availability = true;
        if (previousStatus !== 'completed') volunteer.tasksCompleted += 1;
      }
      await volunteer.save();
    } else {
      ['status', 'severity'].forEach((field) => {
        if (updates[field] !== undefined) request[field] = updates[field];
      });

      if (updates.status && request.assignedVolunteer?.volunteerId) {
        const volunteer = await Volunteer.findById(request.assignedVolunteer.volunteerId);
        if (volunteer) {
          if (updates.status === 'completed' || updates.status === 'cancelled') {
            volunteer.operationalStatus = 'available';
            volunteer.availability = true;
            if (updates.status === 'completed' && previousStatus !== 'completed') {
              volunteer.tasksCompleted += 1;
            }
          } else if (updates.status === 'in_progress') {
            volunteer.operationalStatus = 'on_scene';
            volunteer.availability = false;
          } else if (updates.status === 'assigned') {
            volunteer.operationalStatus = 'assigned';
            volunteer.availability = false;
          }
          await volunteer.save();
        }
      }
    }
    await request.save();

    logger.info('Request updated', {
      requestId: id,
      updates,
      userId: req.user._id
    });

    const response = new ApiResponse(200, request, 'Request updated successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

export const deleteRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const request = await Request.findByIdAndDelete(id);

    if (!request) {
      throw ApiError.notFound('Request not found');
    }

    logger.info('Request deleted', {
      requestId: id,
      userId: req.user._id
    });

    const response = new ApiResponse(200, null, 'Request deleted successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

export const assignVolunteer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { volunteerId } = req.body;

    const request = await Request.findById(id);

    if (!request) {
      throw ApiError.notFound('Request not found');
    }

    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) {
      throw ApiError.notFound('Volunteer not found');
    }

    const previousVolunteerId = request.assignedVolunteer?.volunteerId;
    if (previousVolunteerId && String(previousVolunteerId) !== String(volunteer._id)) {
      await Volunteer.findByIdAndUpdate(previousVolunteerId, {
        availability: true,
        operationalStatus: 'available'
      });
    }

    request.assignedVolunteer = {
      volunteerId: volunteer._id,
      name: volunteer.name,
      phone: volunteer.phone,
      assignedAt: new Date()
    };
    request.status = 'assigned';

    volunteer.operationalStatus = 'assigned';
    volunteer.availability = false;

    await Promise.all([request.save(), volunteer.save()]);

    logger.info('Volunteer assigned to request', {
      requestId: id,
      volunteerId,
      userId: req.user._id
    });

    const response = new ApiResponse(200, request, 'Volunteer assigned successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};
