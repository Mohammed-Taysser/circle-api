import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import CrudService from '../../core/CRUD';
import eventSchema from '../../schema/event/event.schema';
import reviewSchema from '../../schema/event/review.schema';
import { IRequest } from '../../types/app';
import { calculatePagination } from '../../utils/pagination';

class ReviewController extends CrudService<Review> {
  constructor() {
    super(reviewSchema, { paramsId: 'reviewId' });
  }

  async getAll(request: Request, response: Response) {
    const { eventId } = request.params;

    const total = await this.model.countDocuments();

    const pagination = calculatePagination(request);

    try {
      const reviews = await reviewSchema
        .find({ event: eventId })
        .skip(pagination.skip)
        .limit(pagination.limit);

      response
        .status(statusCode.OK)
        .json({ meta: { ...pagination, total }, data: reviews });
    } catch (error) {
      response.status(statusCode.BAD_REQUEST).json({ error });
    }
  }

  async create(req: Request, response: Response) {
    const request = req as IRequest;

    const { eventId } = request.params;

    try {
      const event = await eventSchema.findById(eventId);

      if (!event) {
        response
          .status(statusCode.NOT_FOUND)
          .json({ error: 'Event not found' });
      } else {
        const existingReview = await this.model.findOne({
          event: eventId,
          user: request.user._id,
        });

        if (existingReview) {
          response
            .status(statusCode.BAD_REQUEST)
            .json({ error: 'You have already reviewed this event' });
        } else {
          const body = {
            ...request.body,
            event: eventId,
          };
          const review = await new this.model(body).save();

          response.status(statusCode.CREATED).json({ data: review });
        }
      }
    } catch (error) {
      response.status(statusCode.BAD_REQUEST).json({ error });
    }
  }
}

export default new ReviewController();
