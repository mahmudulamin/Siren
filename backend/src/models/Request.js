import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
  {
    victimName: {
      type: String,
      required: [true, 'Victim name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im, 'Please provide a valid phone number']
    },
    email: {
      type: String,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    coordinates: {
      lat: {
        type: Number,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      lng: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      }
    },
    emergencyType: {
      type: String,
      required: [true, 'Emergency type is required'],
      enum: [
        'Flood',
        'Medical Emergency',
        'Food/Water Shortage',
        'Shelter',
        'Rescue',
        'Other'
      ]
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    severity: {
      type: String,
      required: [true, 'Severity is required'],
      enum: {
        values: ['low', 'medium', 'high', 'critical'],
        message: 'Severity must be one of: low, medium, high, critical'
      }
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'],
        message: 'Status must be one of: pending, assigned, in_progress, completed, cancelled'
      },
      default: 'pending'
    },
    assignedVolunteer: {
      volunteerId: mongoose.Schema.Types.ObjectId,
      name: String,
      phone: String,
      assignedAt: Date
    },
    progressNotes: {
      type: String,
      maxlength: [2000, 'Progress notes cannot exceed 2000 characters'],
      default: ''
    },
    photoUrl: {
      type: String,
      default: null
    },
    clientRequestId: {
      type: String,
      trim: true
    },
    locationSource: {
      type: String,
      enum: ['gps', 'manual', 'address'],
      default: 'address'
    },
    victimId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Index for filtering and searching
requestSchema.index({ status: 1 });
requestSchema.index({ severity: 1 });
requestSchema.index({ emergencyType: 1 });
requestSchema.index({ 'coordinates.lat': 1, 'coordinates.lng': 1 });
requestSchema.index({ createdAt: -1 });
requestSchema.index({ clientRequestId: 1 }, { unique: true, sparse: true });

export default mongoose.model('Request', requestSchema);
