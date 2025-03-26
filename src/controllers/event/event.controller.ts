import { calculatePagination } from '../../utils/pagination';
import CrudService from '../../core/CRUD';
import schema from '../../schema/event/event.schema';
import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import { RootFilterQuery } from 'mongoose';

class EventController extends CrudService<UserEvent> {
  constructor() {
    super(schema, { simpleFields: ['title'], paramsId: 'eventId' });

    this.getEventsNearby = this.getEventsNearby.bind(this);
    this.distanceToEventByPoint = this.distanceToEventByPoint.bind(this);
  }

  async getEventsNearby(request: Request, response: Response) {
    const { radius, latitude, longitude, unit } = request.query;

    if (!radius || !latitude || !longitude || !unit) {
      return response.status(statusCode.BAD_REQUEST).json({
        error: 'Make sure to provide radius, latitude, longitude and unit',
      });
    }

    if (unit !== 'km' && unit !== 'mi') {
      return response
        .status(statusCode.BAD_REQUEST)
        .json({ error: 'Unit must be km or mi' });
    }

    if (
      typeof radius !== 'string' ||
      typeof latitude !== 'string' ||
      typeof longitude !== 'string' ||
      isNaN(parseFloat(radius)) ||
      isNaN(parseFloat(latitude)) ||
      isNaN(parseFloat(longitude))
    ) {
      return response
        .status(statusCode.BAD_REQUEST)
        .json({ error: 'Radius, latitude and longitude must be numbers' });
    }

    const radiusInMeters: number =
      unit === 'km' ? parseFloat(radius) / 6378.2 : parseFloat(radius) / 3963.2;

    try {
      const filters: RootFilterQuery<UserEvent> = {
        location: {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], radiusInMeters],
          },
        },
      };

      const events = await this.model.find(filters);

      const total = await this.model.countDocuments(filters);

      const pagination = calculatePagination(request);

      response
        .status(statusCode.OK)
        .json({ meta: { ...pagination, total }, data: events });
    } catch (error) {
      response.status(statusCode.BAD_REQUEST).json({ error });
    }
  }

  async distanceToEventByPoint(request: Request, response: Response) {
    const { latitude, longitude, unit } = request.query;

    if (!latitude || !longitude) {
      return response.status(statusCode.BAD_REQUEST).json({
        error: 'Make sure to provide latitude and longitude',
      });
    }

    if (
      typeof latitude !== 'string' ||
      typeof longitude !== 'string' ||
      isNaN(parseFloat(latitude)) ||
      isNaN(parseFloat(longitude))
    ) {
      return response
        .status(statusCode.BAD_REQUEST)
        .json({ error: 'Latitude and longitude must be numbers' });
    }

    if (unit && unit !== 'km' && unit !== 'mi') {
      return response
        .status(statusCode.BAD_REQUEST)
        .json({ error: 'Unit must be km or mi' });
    }

    const distanceMultiplier = unit === 'km' ? 0.001 : 0.00062137;

    try {
      const distance = await this.model.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
            distanceField: 'distance',
            spherical: true,
            distanceMultiplier,
          },
        },
        {
          $project: {
            title: 1,
            location: 1,
            distance: 1,
          },
        },
      ]);

      response.status(statusCode.OK).json({ data: distance });
    } catch (error) {
      response.status(statusCode.BAD_REQUEST).json({ error });
    }
  }
}

export default new EventController();
