import mongoose from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';

const eventSchema = new mongoose.Schema<UserEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required!'],
      trim: true,
      minlength: [3, 'Title should be at least 3 characters!'],
    },
    body: {
      type: String,
      default: '',
      trim: true,
    },
    startDate: {
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
      // validate: {
      //   validator(v: any) {
      //     return new Set(v).size === v.length;
      //   },
      //   message: '{VALUE} contains duplicate attendees!',
      // },
    },
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        required: [true, 'Location is required!'],
      },
    },
    formattedAddress: {
      type: String,
    },
    type: {
      type: String,
      default: 'event',
      enum: ['event', 'birthday', 'anniversary', 'other'],
    },
    color: {
      type: String,
      default: '#000000',
    },
    rate: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating must be at most 5'],
      set: (value: number) => value.toFixed(2),
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price must be at least 0'],
    },
    rateCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.plugin(mongooseAutoPopulate);

eventSchema.index({ location: '2dsphere' });
eventSchema.index({ startDate: 1 });
eventSchema.index({ endDate: 1 });
eventSchema.index({ user: 1 });

eventSchema.pre('save', function (next) {
  if (this.startDate > this.endDate) {
    return next(new Error('Start Date must be before End Date!'));
  }

  next();
});

export default mongoose.model<UserEvent>('Event', eventSchema);
