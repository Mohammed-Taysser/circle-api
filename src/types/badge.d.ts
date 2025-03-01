import mongoose, { ObjectId } from 'mongoose';

interface Badge {
  _id: ObjectId;
  label: string;
  body: string;
  picture: string;
}

type IBadge = mongoose.Document & Badge;

