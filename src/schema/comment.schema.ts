import { Schema, model } from 'mongoose';
import { IComment } from 'types/post';

const commentSchema = new Schema<IComment>(
  {
    body: {
      type: String,
      default: '',
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
    timestamps: {
      createdAt: 'publishAt',
      updatedAt: 'editAt',
    },
  }
);

export default model<IComment>('Comment', commentSchema);
