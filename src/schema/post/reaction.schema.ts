import { model, Schema } from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';

const reactionSchema = new Schema<Reaction>(
  {
    react: {
      type: String,
      default: 'like',
      enum: ['like', 'love', 'star', 'wow'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: {
        select: 'username firstName lastName avatar',
        maxDepth: 1,
      },
      required: [true, 'user not provided!'],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
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

reactionSchema.index({ post: 1 });
reactionSchema.index({ react: 1 });
reactionSchema.index({ user: 1 });

export default model<Reaction>('Reactions', reactionSchema);
