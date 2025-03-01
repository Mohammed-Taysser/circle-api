import { Schema, model } from 'mongoose';
import { IComment } from 'types/post';

const commentSchema = new Schema<IComment>(
  {
    body: {
      type: String,
      trim: true,
      required: [true, 'comment can\'t be empty!']
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
    timestamps:true
  }
);

export default model<IComment>('Comment', commentSchema);
