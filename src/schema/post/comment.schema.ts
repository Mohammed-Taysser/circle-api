import { Schema, model } from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';

const commentSchema = new Schema<UserComment>(
  {
    body: {
      type: String,
      trim: true,
      required: [true, "comment can't be empty!"],
      minlength: [1, 'comment is too short!'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'user not provided!'],
      index: true,
      autopopulate: {
        select: 'username firstName lastName avatar',
        maxDepth: 1,
      },
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'post not provided!'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.plugin(mongooseAutoPopulate);

export default model<UserComment>('Comment', commentSchema);
