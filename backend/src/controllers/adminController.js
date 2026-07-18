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
        $match: {
          status: { $nin: ['completed', 'cancelled'] },
          'coordinates.lat': { $type: 'number' },
          'coordinates.lng': { $type: 'number' }
        }
      },
      {
        $addFields: {
          severityRisk: {
            $switch: {
              branches: [
                { case: { $eq: ['$severity', 'critical'] }, then: 92 },
                { case: { $eq: ['$severity', 'high'] }, then: 74 },
                { case: { $eq: ['$severity', 'medium'] }, then: 52 }
              ],
              default: 25
            }
          }
        }
      },
      {
        $group: {
          _id: '$address',
          count: { $sum: 1 },
          maxRisk: { $max: '$severityRisk' },
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

    const enrichedZones = zones.map((zone, index) => {
      const riskScore = Math.min(100, zone.maxRisk + Math.min(8, (zone.count - 1) * 2));
      const severity = riskScore >= 75 ? 'critical' : riskScore >= 40 ? 'moderate' : 'safe';

      return {
        id: `zone-${index}`,
        name: zone._id || 'Reported location',
        severity,
        riskScore,
        coordinates: { lat: zone.lat, lng: zone.lng },
        affectedPopulation: zone.count,
        requestCount: zone.count,
        prediction: `${zone.count} active emergency request(s) detected in this area`,
        recommendations: ['Verify reports', 'Alert nearby volunteers', 'Coordinate emergency response'],
        updatedAt: new Date().toISOString()
      };
    });

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
