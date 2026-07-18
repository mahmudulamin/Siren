import Request from '../models/Request.js';
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
      photoUrl
    } = req.body;

    const request = new Request({
      victimName,
      phone,
      email: email || undefined,
      address,
      coordinates,
      emergencyType,
      description,
      severity,
      photoUrl: photoUrl || null,
      victimId: req.user._id
    });

    await request.save();

    logger.info('Emergency request created', {
      requestId: request._id,
      severity,
      userId: req.user._id
    });

    const response = new ApiResponse(201, request, 'Request created successfully');
    res.status(201).json(response.toJSON());
  } catch (error) {
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

    // Update fields
    Object.assign(request, updates);
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
    const { volunteerId, volunteerName, volunteerPhone } = req.body;

    const request = await Request.findById(id);

    if (!request) {
      throw ApiError.notFound('Request not found');
    }

    request.assignedVolunteer = {
      volunteerId,
      name: volunteerName,
      phone: volunteerPhone,
      assignedAt: new Date()
    };
    request.status = 'assigned';

    await request.save();

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
