import mongoose from 'mongoose';

export interface Badge {
  _id: string;
  label: string;
  body: string;
  picture: string;
  earnedAt: Date;
  updatedAt: Date;
}

export interface BadgeSaveBody {
  email: string;
  password: string;
}
export type BadgeUpdateBody = Partial<Badge>;

export type SavedBadgeDocument = mongoose.Document & Badge;
