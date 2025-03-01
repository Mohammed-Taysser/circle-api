import mongoose from 'mongoose';
import { IGroup } from 'types/group';

const groupSchema = new mongoose.Schema(
  {
    visibility: {
      type: String,
      default: 'public',
      enum: ['public', 'private', 'friends'],
    },
    name: {
      type: String,
      required: [true, 'name not provided!'],
      trim: true,
      minlength: [2, 'name too short!'],
      maxlength: [50, 'name too long!'],
    },
    avatar: {
      type: String,
      default: '/avatar.jpg',
      trim: true,
    },
    cover: {
      type: String,
      default: '/cover.jpg',
      trim: true,
    },
    badges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge',
        autopopulate: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IGroup>('Group', groupSchema);
