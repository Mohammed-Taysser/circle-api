import mongoose, { Schema } from 'mongoose';
import { IPost } from 'types/post';

const postSchema = new Schema<IPost>(
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
    },
    assets: {
      friend: {
        type: String,
        default: '',
      },
      group: {
        type: String,
        default: '',
      },
      youtube: {
        type: String,
        default: '',
      },
      cover: {
        type: String,
        default: '',
      },
      avatar: {
        type: String,
        default: '',
      },
      gallery: {
        type: [String],
        default: [],
      },
      audio: {
        type: String,
        default: '',
      },
      video: {
        type: String,
        default: '',
      },
    },
  },
  {
    timestamps: {
      createdAt: 'publishAt',
      updatedAt: 'editAt',
    },
  }
);

export default mongoose.model<IPost>('Post', postSchema);
