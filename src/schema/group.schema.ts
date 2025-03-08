import mongoose from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';

const groupSchema = new mongoose.Schema<Group>(
  {
    visibility: {
      type: String,
      default: 'public',
      enum: ['public', 'private', 'friends'],
    },
    name: {
      type: String,
      required: [true, 'name not provided!'],
      trim: true,
      minlength: [2, 'name too short!'],
      unique: [true, 'name must be unique!'],
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
              select: 'label body logo',
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

groupSchema.index({ name: 1 });
groupSchema.index({ visibility: 1 });

export default mongoose.model<Group>('Group', groupSchema);
