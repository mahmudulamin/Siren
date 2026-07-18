import User from '../models/User.js';
import Volunteer from '../models/Volunteer.js';
import { generateToken } from '../utils/generateToken.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, name, phone, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn('Duplicate email registration attempt', { email });
      throw ApiError.conflict('Email already registered');
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      phone,
      role
    });

    await user.save();

    if (user.role === 'volunteer') {
      await Volunteer.findOneAndUpdate(
        { userId: user._id },
        {
          $setOnInsert: {
            userId: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            availability: true,
            operationalStatus: 'available'
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // Generate token
    const token = generateToken({
      _id: user._id,
      email: user.email,
      role: user.role
    });

    logger.info('User registered successfully', { userId: user._id, email: user.email });

    const response = new ApiResponse(201, {
      token,
      user: user.toJSON()
    }, 'Registration successful');

    res.status(201).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      logger.warn('Login attempt with non-existent email', { email });
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Check role match
    if (user.role !== role) {
      logger.warn('Login attempt with incorrect role', { email, providedRole: role, userRole: user.role });
      throw ApiError.unauthorized('Role does not match');
    }

    // Verify password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      logger.warn('Login attempt with incorrect password', { email });
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Generate token
    const token = generateToken({
      _id: user._id,
      email: user.email,
      role: user.role
    });

    logger.info('User logged in successfully', { userId: user._id, email: user.email });

    const response = new ApiResponse(200, {
      token,
      user: user.toJSON()
    }, 'Login successful');

    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const response = new ApiResponse(200, user.toJSON(), 'User retrieved successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

export const updateCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) throw ApiError.notFound('User not found');

    const { name, phone } = req.body;
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    await user.save();

    if (user.role === 'volunteer') {
      await Volunteer.findOneAndUpdate(
        { userId: user._id },
        { name: user.name, phone: user.phone }
      );
    }

    const response = new ApiResponse(200, user.toJSON(), 'Profile updated successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) throw ApiError.notFound('User not found');

    const matches = await user.comparePassword(req.body.currentPassword);
    if (!matches) throw ApiError.badRequest('Current password is incorrect');

    user.password = req.body.newPassword;
    await user.save();

    const response = new ApiResponse(200, null, 'Password changed successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    logger.info('User logged out', { userId: req.user._id });

    const response = new ApiResponse(200, null, 'Logout successful');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};
