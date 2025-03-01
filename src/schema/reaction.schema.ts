import { model, Schema } from 'mongoose';
import { IReaction } from 'types/post';

const reactionSchema = new Schema<IReaction>(
  {
    react: {
      type: String,
      default: 'like',
      enum: ['like', 'love', 'star', 'wow'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  },
  {
    timestamps: true
  }
);

export default model<IReaction>('Reactions', reactionSchema);
