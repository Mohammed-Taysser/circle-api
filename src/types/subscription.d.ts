import mongoose from 'mongoose';

interface Subscription {
  _id: string;
  email: string;
  isVerified: boolean;
}

type ISubscription = mongoose.Document & Subscription;
