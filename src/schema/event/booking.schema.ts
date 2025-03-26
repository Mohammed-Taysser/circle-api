import mongoose from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';

const bookingSchema = new mongoose.Schema<Booking>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required!'],
      autopopulate: {
        select: 'firstName lastName avatar',
        maxDepth: 1,
      },
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event is required!'],
      autopopulate: {
        select: 'title',
        maxDepth: 1,
      },
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'accepted', 'rejected'],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      required: [true, 'Price is required!'],
      min: [0, 'Price must be at least 0'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required!'],
      min: [1, 'Quantity must be at least 1'],
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.plugin(mongooseAutoPopulate);

export default mongoose.model<Booking>('Booking', bookingSchema);
