import mongoose from 'mongoose';
import { IEvent } from 'types/event';

const eventSchema = new mongoose.Schema<IEvent>(
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
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEvent>('Event', eventSchema);
