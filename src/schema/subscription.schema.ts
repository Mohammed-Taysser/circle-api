import mongoose from 'mongoose';
import { ISubscription } from 'types/subscription';

const subscriptionSchema = new mongoose.Schema<ISubscription>(
  {
    email: {
      type: String,
      required: [true, 'email not provided!'],
      unique: true,
    },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISubscription>(
  'Subscription',
  subscriptionSchema
);
