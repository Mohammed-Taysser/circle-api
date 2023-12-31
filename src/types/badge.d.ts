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
  label: string;
  body: string;
  picture: string;
  earnedAt: Date;
  updatedAt: Date;
}
export type BadgeUpdateBody = Partial<Badge>;

export type SavedBadgeDocument = mongoose.Document & Badge;
