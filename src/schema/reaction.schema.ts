import { model, Schema } from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';

const reactionSchema = new Schema<Reaction>(
  {
    react: {
      type: String,
      index: true,
      default: 'like',
      enum: ['like', 'love', 'star', 'wow'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      autopopulate: {
        select: 'username firstName lastName avatar',
        maxDepth: 1,
      },
      required: [true, 'user not provided!'],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      index: true,
      autopopulate: {
        select: 'title',
        maxDepth: 1,
      },
      required: [true, 'post not provided!'],
    },
  },
  {
    timestamps: true,
  }
);

reactionSchema.plugin(mongooseAutoPopulate);

export default model<Reaction>('Reactions', reactionSchema);
