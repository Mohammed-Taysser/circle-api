import mongoose from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';

const groupSchema = new mongoose.Schema<Group>(
  {
    visibility: {
      type: String,
      default: 'public',
      index: true,
      enum: ['public', 'private', 'friends'],
    },
    name: {
      type: String,
      required: [true, 'name not provided!'],
      trim: true,
      minlength: [2, 'name too short!'],
      maxlength: [50, 'name too long!'],
      unique: [true, 'name must be unique!'],
      index: true,
    },
    avatar: {
      type: String,
      default: '/avatar.jpg',
      trim: true,
    },
    cover: {
      type: String,
      default: '/cover.jpg',
      trim: true,
    },
    badges: {
      type: [
        {
          badge: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Badge',
            autopopulate: {
              select: 'label body picture',
              maxDepth: 1,
            },
          },
          earnAt: { type: Date, default: () => new Date() }, // Ensures dynamic default date
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

groupSchema.plugin(mongooseAutoPopulate);

export default mongoose.model<Group>('Group', groupSchema);
