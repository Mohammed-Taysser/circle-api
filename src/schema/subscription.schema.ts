import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema<Subscription>(
  {
    email: {
      type: String,
      required: [true, 'email not provided!'],
      unique: true,
      trim: true,
    },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Subscription>('Subscription', subscriptionSchema);
