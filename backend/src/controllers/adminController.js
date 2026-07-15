import Request from '../models/Request.js';
import Volunteer from '../models/Volunteer.js';
import Donation from '../models/Donation.js';
import User from '../models/User.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalRequests,
      pendingRequests,
      activeVolunteers,
      volunteers,
      donations,
      completedRequests,
      criticalRequests
    ] = await Promise.all([
      Request.countDocuments(),
      Request.countDocuments({ status: 'pending' }),
      Volunteer.countDocuments({ availability: true }),
      Volunteer.find(),
      Donation.find({ status: 'completed' }),
      Request.countDocuments({ status: 'completed' }),
      Request.countDocuments({ severity: 'critical' })
    ]);

    const completedTasks = volunteers.reduce((sum, v) => sum + v.tasksCompleted, 0);
    const responseRate = totalRequests > 0 ? ((completedRequests / totalRequests) * 100).toFixed(2) : 0;

    const allRequests = await Request.find();
    let avgResponseTime = 0;

    if (completedRequests > 0) {
      const responseTimes = allRequests
        .filter(r => r.status === 'completed')
        .map(r => (new Date(r.updatedAt) - new Date(r.createdAt)) / (1000 * 60 * 60));
      avgResponseTime = (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1);
    }

    const stats = {
      totalRequests,
      pendingRequests,
      activeVolunteers,
      completedTasks,
      criticalRequests,
      responseRate: parseFloat(responseRate),
      averageResponseTime: `${avgResponseTime} hours`,
      activeDisasters: await getActiveDisasters(),
      totalDonations: donations.reduce((sum, d) => sum + (d.amount || 0), 0),
      totalVolunteers: volunteers.length
    };

    const response = new ApiResponse(200, stats, 'Dashboard stats retrieved successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const { period = '7d' } = req.query;

    const daysMap = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };

    const days = daysMap[period] || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
      requestsByDay,
      requestsByType,
      requestsBySeverity,
      volunteerPerformance
    ] = await Promise.all([
      getRequestsByDay(startDate),
      getRequestsByType(),
      getRequestsBySeverity(),
      getVolunteerPerformance()
    ]);

    const analytics = {
      requestsByDay,
      requestsByType,
      requestsBySeverity,
      volunteerPerformance
    };

    const response = new ApiResponse(200, analytics, 'Analytics retrieved successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

export const getZonePredictions = async (req, res, next) => {
  try {
    const zones = await Request.aggregate([
      {
        $group: {
          _id: '$address',
          count: { $sum: 1 },
          severity: { $max: '$severity' },
          coordinates: { $first: '$coordinates' },
          lat: { $avg: '$coordinates.lat' },
          lng: { $avg: '$coordinates.lng' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    const enrichedZones = zones.map((zone, index) => ({
      id: `zone-${index}`,
      name: zone._id,
      severity: getSeverityLevel(zone.count),
      riskScore: Math.min(100, zone.count * 10),
      coordinates: {
        lat: zone.lat,
        lng: zone.lng
      },
      affectedPopulation: zone.count * 50,
      prediction: `High activity zone with ${zone.count} recent requests`
    }));

    const response = new ApiResponse(200, enrichedZones, 'Zone predictions retrieved successfully');
    res.status(200).json(response.toJSON());
  } catch (error) {
    next(error);
  }
};

// Helper functions
const getRequestsByDay = async (startDate) => {
  return await Request.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
};

const getRequestsByType = async () => {
  return await Request.aggregate([
    {
      $group: {
        _id: '$emergencyType',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

const getRequestsBySeverity = async () => {
  return await Request.aggregate([
    {
      $group: {
        _id: '$severity',
        count: { $sum: 1 }
      }
    }
  ]);
};

const getVolunteerPerformance = async () => {
  return await Volunteer.find()
    .select('name tasksCompleted rating')
    .sort({ tasksCompleted: -1 })
    .limit(10);
};

const getActiveDisasters = async () => {
  const criticalZones = await Request.aggregate([
    {
      $match: { severity: 'critical' }
    },
    {
      $group: {
        _id: '$address'
      }
    }
  ]);

  return criticalZones.length;
};

const getSeverityLevel = (count) => {
  if (count >= 20) return 'critical';
  if (count >= 10) return 'high';
  if (count >= 5) return 'medium';
  return 'low';
};
