import mongoose from 'mongoose';
import { Group } from '../types/app';

const groupSchema = new mongoose.Schema(
  {
    visibility: {
      type: String,
      default: 'public',
      enum: ['public', 'private'],
      required: [true, 'Please specify group visibility'],
    },
    name: { type: String, required: [true, 'name not provided!'] },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/mohammed-taysser/image/upload/v1654679434/paperCuts/authors/avatar-2_grpukn.png',
    },
    cover: {
			type: String,
			default:
				'https://res.cloudinary.com/mohammed-taysser/image/upload/v1657350049/lama/users/5437842_py0e8h.jpg',
		},
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Group>('Group', groupSchema);
