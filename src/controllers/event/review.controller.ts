import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import CrudService from '../../core/CRUD';
import eventSchema from '../../schema/event/event.schema';
import reviewSchema from '../../schema/event/review.schema';
import { AuthenticatedRequest, FilterRequest } from '../../types/app';

class ReviewController extends CrudService<Review> {
  constructor() {
    super(reviewSchema, { paramsId: 'reviewId' });
  }

  async getAll(req: Request, response: Response) {
    const request = req as FilterRequest<Review>;
    const { eventId } = request.params;

    request.filters = { event: eventId };

    super.getAll(request, response);
  }

  async create(req: Request, response: Response) {
    const request = req as AuthenticatedRequest;

    const { eventId } = request.params;

    try {
      const event = await eventSchema.findById(eventId);

      if (!event) {
        return response
          .status(statusCode.NOT_FOUND)
          .json({ error: 'Event not found' });
      }

      const existingReview = await this.model.findOne({
        event: eventId,
        user: request.user._id,
      });

      if (existingReview) {
        return response
          .status(statusCode.BAD_REQUEST)
          .json({ error: 'You have already reviewed this event' });
      }

      const body = {
        ...request.body,
        event: eventId,
      };

      request.body = body;

      super.create(request, response);
    } catch (error) {
      response.status(statusCode.BAD_REQUEST).json({ error });
    }
  }
}

export default new ReviewController();
