import mongoose, { Schema } from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';

const postSchema = new Schema<Post>(
  {
    variant: {
      type: String,
      default: 'blog',
      enum: [
        'cover',
        'avatar',
        'blog',
        'gallery',
        'video',
        'audio',
        'youtube',
        'group',
        'friend',
        'share',
      ],
    },
    visibility: {
      type: String,
      default: 'public',
      enum: ['public', 'friends', 'private'],
    },
    activity: {
      type: String,
      default: '',
    },
    body: {
      type: String,
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'user not provided!'],
      autopopulate: {
        select: 'username firstName lastName avatar',
        maxDepth: 1,
      },
    },
    assets: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'PostAsset',
          autopopulate: true,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

postSchema.plugin(mongooseAutoPopulate);

postSchema.index({ user: 1 });
postSchema.index({ variant: 1 });
postSchema.index({ visibility: 1 });

export default mongoose.model<Post>('Post', postSchema);
