import mongoose from 'mongoose';
import { SavedSubscriptionDocument } from 'types/subscription';

const subscriptionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'email not provided!'],
      unique: [true, 'email already exists!'],
    },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<SavedSubscriptionDocument>(
  'Subscription',
  subscriptionSchema
);
