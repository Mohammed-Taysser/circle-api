import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema<Badge>(
  {
    label: {
      type: String,
      required: [true, 'label not provided!'],
      trim: true,
      minlength: [3, 'label should be at least 3 characters!'],
      maxlength: [50, 'label should be at most 50 characters!'],
      unique: [true, 'label must be unique!'],
    },
    body: {
      type: String,
      required: [true, 'body not provided!'],
      trim: true,
      minlength: [10, 'body should be at least 10 characters!'],
      maxlength: [500, 'body should be at most 500 characters!'],
    },
    picture: {
      type: String,
      trim: true,
      default: '/avatar.jpg',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Badge>('Badge', badgeSchema);
