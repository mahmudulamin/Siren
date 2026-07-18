import Donation from '../models/Donation.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';
import crypto from 'crypto';

export const createDonation = async (req, res, next) => {
  try {
    const {
      donorName,
      email,
      phone,
      type,
      category,
      amount,
      currency,
      items,
      quantity,
      description,
      anonymous,
      paymentMethod
    } = req.body;

    const transactionId = `SIREN-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;

    const donation = new Donation({
      donorId: req.user?._id || null,
      donorName,
      email,
      phone,
      type,
      category,
      amount: type === 'money' ? amount : null,
      currency: type === 'money' ? currency : null,
      items: type === 'supply' ? items : null,
      quantity: type === 'supply' ? quantity : null,
      description,
      anonymous,
      paymentMethod,
      transactionId,
      status: 'pending'
    });

    await donation.save();

    logger.info('Donation created', {
      donationId: donation._id,
      type,
      amount: type === 'money' ? amount : null
    });

    const response = new ApiResponse(201, donation, 'Donation created successfully');
    res.status(201).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

export const getAllDonations = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      type
    } = req.query;

    const isOfficial = req.user?.role === 'official';
    const filter = isOfficial ? {} : { anonymous: false };

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (type) filter.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [donations, total] = await Promise.all([
      Donation.find(filter)
        .select('-donorId')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Donation.countDocuments(filter)
    ]);

    const visibleDonations = isOfficial
      ? donations
      : donations.map((donation) => ({
          ...donation.toObject(),
          email: undefined,
          phone: undefined,
          donorId: undefined
        }));

    const response = new ApiResponse(200, {
      donations: visibleDonations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'Donations retrieved successfully');

    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

export const getUserDonations = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [donations, total] = await Promise.all([
      Donation.find({ donorId: req.user._id })
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Donation.countDocuments({ donorId: req.user._id })
    ]);

    const response = new ApiResponse(200, {
      donations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'User donations retrieved successfully');

    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

export const getDonationStats = async (req, res, next) => {
  try {
    const stats = await Donation.aggregate([
      {
        $group: {
          _id: null,
          totalDonations: { $sum: { $cond: [{ $eq: ['$type', 'money'] }, '$amount', 0] } },
          donationCount: { $sum: 1 },
          supplyDonations: { $sum: { $cond: [{ $eq: ['$type', 'supply'] }, 1, 0] } },
          averageDonation: { $avg: { $cond: [{ $eq: ['$type', 'money'] }, '$amount', 0] } }
        }
      }
    ]);

    const response = new ApiResponse(200, stats[0] || {
      totalDonations: 0,
      donationCount: 0,
      supplyDonations: 0,
      averageDonation: 0
    }, 'Donation stats retrieved successfully');

    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

export const updateDonationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'verified', 'completed', 'failed'].includes(status)) {
      throw ApiError.badRequest('Invalid status');
    }

    const donation = await Donation.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!donation) {
      throw ApiError.notFound('Donation not found');
    }

    logger.info('Donation status updated', {
      donationId: id,
      status
    });

    const response = new ApiResponse(200, donation, 'Donation status updated successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

export const getDonationsByCategory = async (req, res, next) => {
  try {
    const donations = await Donation.aggregate([
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: { $cond: [{ $eq: ['$type', 'money'] }, '$amount', 0] } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { totalAmount: -1 }
      }
    ]);

    const response = new ApiResponse(200, donations, 'Donations by category retrieved successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};
