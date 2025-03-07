import mongoose from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';
import eventSchema from './event.schema';

interface ReviewModel extends mongoose.Model<Review> {
  calculateAverageRating(eventId: string): Promise<void>;
}

const reviewSchema = new mongoose.Schema<Review>(
  {
    body: {
      type: String,
      required: [true, 'body not provided!'],
      trim: true,
      minlength: [10, 'body should be at least 10 characters!'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'user not provided!'],
      index: true,
      autopopulate: {
        select: 'username firstName lastName avatar',
        maxDepth: 1,
      },
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'event not provided!'],
      index: true,
    },
    rate: {
      type: Number,
      default: 1,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.plugin(mongooseAutoPopulate);

reviewSchema.index({ event: 1, user: 1 }, { unique: true });

reviewSchema.static('calculateAverageRating', async function (eventId: string) {
  const stats = await this.aggregate([
    { $match: { event: eventId } },
    {
      $group: {
        _id: '$event',
        rating: { $avg: '$rate' },
        rateCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await eventSchema.findOneAndUpdate(
      { _id: eventId },
      {
        rate: stats[0].rating,
        rateCount: stats[0].rateCount,
      }
    );
  }
});

reviewSchema.post('save', function () {
  (this.constructor as ReviewModel).calculateAverageRating(this.event._id);
});

// Ensure rating updates when a review is edited
reviewSchema.post('findOneAndUpdate', async function (doc) {
  if (doc) {
    await (doc.constructor as ReviewModel).calculateAverageRating(
      doc.event._id
    );
  }
});

// Ensure rating updates when a review is deleted
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await (doc.constructor as ReviewModel).calculateAverageRating(
      doc.event._id
    );
  }
});

export default mongoose.model<Review>('Review', reviewSchema);
