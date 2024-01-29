import mongoose from 'mongoose';

interface Badge {
  _id: string;
  label: string;
  body: string;
  picture: string;
  earnedAt: Date;
  updatedAt: Date;
}

type IBadge = mongoose.Document & Badge;
