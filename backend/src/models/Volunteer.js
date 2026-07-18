import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, 'Phone is required']
    },
    skills: {
      type: [String],
      default: []
    },
    availability: {
      type: Boolean,
      default: true
    },
    operationalStatus: {
      type: String,
      enum: ['available', 'assigned', 'en_route', 'on_scene', 'unavailable'],
      default: 'available'
    },
    location: {
      lat: {
        type: Number,
        default: null
      },
      lng: {
        type: Number,
        default: null
      }
    },
    lastLocationAt: {
      type: Date,
      default: null
    },
    tasksCompleted: {
      type: Number,
      default: 0,
      min: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: ''
    },
    profileImage: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Index for frequently queried fields
volunteerSchema.index({ userId: 1 });
volunteerSchema.index({ availability: 1 });
volunteerSchema.index({ operationalStatus: 1 });
volunteerSchema.index({ 'location.lat': 1, 'location.lng': 1 });

export default mongoose.model('Volunteer', volunteerSchema);
