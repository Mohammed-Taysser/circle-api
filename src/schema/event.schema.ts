import mongoose from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';

const eventSchema = new mongoose.Schema<UserEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required!'],
      trim: true,
      minlength: [3, 'Title should be at least 3 characters!'],
      maxlength: [100, 'Title should be at most 100 characters!'],
    },
    body: {
      type: String,
      default: '',
      trim: true,
      maxlength: [5000, 'Body should be at most 5000 characters!'],
    },
    startDate: {
      index: true,
      type: Date,
      required: [true, 'Start Date is required!'],
    },
    endDate: {
      type: Date,
      required: [true, 'End Date is required!'],
    },
    allDay: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      required: [true, 'User is required!'],
      autopopulate: {
        select: 'firstName lastName avatar',
        maxDepth: 1,
      },
    },
    attendees: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          autopopulate: {
            select: 'firstName lastName avatar',
            maxDepth: 1,
          },
        },
      ],
      default: [],
    },
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
      },
      formattedAddress: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.plugin(mongooseAutoPopulate);

eventSchema.pre('save', function (next) {
  if (this.startDate > this.endDate) {
    return next(new Error('Start Date must be before End Date!'));
  }
  next();
});

export default mongoose.model<UserEvent>('Event', eventSchema);
