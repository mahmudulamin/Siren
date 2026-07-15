import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    donorName: {
      type: String,
      required: [true, 'Donor name is required']
    },
    email: {
      type: String,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String
    },
    type: {
      type: String,
      enum: ['money', 'supply'],
      required: [true, 'Donation type is required']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'General Relief Fund',
        'Food & Water Supplies',
        'Medical Supplies & Treatment',
        'Shelter & Rehabilitation',
        'Rescue Operations',
        'Emergency Reserve Fund'
      ]
    },
    amount: {
      type: Number,
      required: function () {
        return this.type === 'money';
      },
      min: [0.01, 'Amount must be greater than 0']
    },
    currency: {
      type: String,
      default: 'BDT',
      enum: ['BDT', 'USD', 'EUR']
    },
    items: {
      type: [String],
      required: function () {
        return this.type === 'supply';
      }
    },
    quantity: {
      type: Number,
      required: function () {
        return this.type === 'supply';
      }
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    anonymous: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'completed', 'failed'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['bKash', 'Nagad', 'Rocket', 'Card', 'Bank Transfer', 'Direct'],
      default: 'Direct'
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    notes: String
  },
  {
    timestamps: true
  }
);

// Index for frequently queried fields
donationSchema.index({ donorId: 1 });
donationSchema.index({ status: 1 });
donationSchema.index({ category: 1 });
donationSchema.index({ createdAt: -1 });

export default mongoose.model('Donation', donationSchema);
