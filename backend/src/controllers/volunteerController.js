import Volunteer from '../models/Volunteer.js';
import User from '../models/User.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

export const getAllVolunteers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      availability
    } = req.query;

    const filter = {};

    if (availability !== undefined) {
      filter.availability = availability === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [volunteers, total] = await Promise.all([
      Volunteer.find(filter)
        .populate('userId', 'name email phone role')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Volunteer.countDocuments(filter)
    ]);

    const response = new ApiResponse(200, {
      volunteers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'Volunteers retrieved successfully');

    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

export const getVolunteerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const volunteer = await Volunteer.findById(id).populate('userId', 'name email phone role');

    if (!volunteer) {
      throw ApiError.notFound('Volunteer not found');
    }

    const response = new ApiResponse(200, volunteer, 'Volunteer retrieved successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

export const updateVolunteer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const volunteer = await Volunteer.findById(id);

    if (!volunteer) {
      throw ApiError.notFound('Volunteer not found');
    }

    // Update fields
    Object.assign(volunteer, updates);
    await volunteer.save();

    logger.info('Volunteer updated', {
      volunteerId: id,
      updates,
      userId: req.user._id
    });

    const updatedVolunteer = await Volunteer.findById(id).populate('userId', 'name email phone role');

    const response = new ApiResponse(200, updatedVolunteer, 'Volunteer updated successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

export const createVolunteerProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    // Check if volunteer profile already exists
    const existingVolunteer = await Volunteer.findOne({ userId: req.user._id });

    if (existingVolunteer) {
      throw ApiError.conflict('Volunteer profile already exists');
    }

    const volunteer = new Volunteer({
      userId: req.user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      skills: req.body.skills || [],
      availability: req.body.availability || true,
      location: req.body.location || { lat: null, lng: null },
      bio: req.body.bio || ''
    });

    await volunteer.save();

    logger.info('Volunteer profile created', {
      volunteerId: volunteer._id,
      userId: req.user._id
    });

    const response = new ApiResponse(201, volunteer, 'Volunteer profile created successfully');
    res.status(201).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

export const getVolunteerStats = async (req, res, next) => {
  try {
    const volunteerId = req.params.id || req.user._id;

    const volunteer = await Volunteer.findById(volunteerId);

    if (!volunteer) {
      throw ApiError.notFound('Volunteer not found');
    }

    const stats = {
      tasksCompleted: volunteer.tasksCompleted,
      rating: volunteer.rating,
      availability: volunteer.availability,
      skills: volunteer.skills,
      joinedAt: volunteer.createdAt
    };

    const response = new ApiResponse(200, stats, 'Volunteer stats retrieved successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};
