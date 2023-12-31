import mongoose from 'mongoose';

export interface Subscription {
  _id: string;
  email: string;
  isVerified: boolean;
}

export interface SubscriptionSaveBody {
  email: string;
}
export type SubscriptionUpdateBody = Partial<Subscription>;

export type SavedSubscriptionDocument = mongoose.Document & Subscription;
