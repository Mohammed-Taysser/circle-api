import mongoose from 'mongoose';
import { IEvent } from 'types/event';

const eventSchema = new mongoose.Schema<IEvent>(
  {
    title: { type: String, required: [true, 'label not provided!'] },
    body: { type: String, default: '' },
    startDate: { type: Date, required: [true, 'Start Date not provided!'] },
    endDate: { type: Date, required: [true, 'End Date not provided!'] },
    allDay: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEvent>('Event', eventSchema);
