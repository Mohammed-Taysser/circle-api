import mongoose from 'mongoose';
import { IBadge } from 'types/badge';

const badgeSchema = new mongoose.Schema<IBadge>(
  {
    label: { type: String, required: [true, 'label not provided!'] },
    body: { type: String, required: [true, 'body not provided!'] },
    picture: { type: String, required: [true, 'picture not provided!'] },
  },
  {
    timestamps: {
      createdAt: 'earnedAt',
      updatedAt: 'updatedAt',
    },
  }
);

export default mongoose.model<IBadge>('Badge', badgeSchema);
