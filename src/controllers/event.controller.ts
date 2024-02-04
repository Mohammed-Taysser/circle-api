import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import { IRequest } from 'types/app';
import { Event } from 'types/event';
import schema from '../schema/event.schema';
import { calculatePagination } from '../utils/pagination';

async function allEvents(request: Request, response: Response) {
  const pagination = calculatePagination(request);

  try {
    const total = await schema.countDocuments();

    await schema
      .find()
      .skip(pagination.skip)
      .limit(pagination.limit)
      .populate({
        path: 'user',
        select: 'firstName lastName username avatar',
      })
      .then((events) => {
        response.status(statusCode.OK).json({ events, total });
      });
  } catch (error) {
    response.status(statusCode.BAD_REQUEST).json({ error });
  }
}

async function getEvent(request: Request, response: Response) {
  const { id } = request.params;

  await schema
    .findById(id)
    .populate({
      path: 'user',
      select: 'firstName lastName username avatar',
    })
    .then((event) => {
      if (event) {
        response.status(statusCode.OK).json({ event });
      } else {
        response.status(statusCode.NOT_FOUND).json({ event });
      }
    })
    .catch((error) => {
      response.status(statusCode.BAD_REQUEST).json({ error });
    });
}

async function createEvent(req: Request, response: Response) {
  const request = req as IRequest;

  try {
    const body = {
      user: request.user._id,
      body: request.body?.body,
      title: request.body?.title,
      startDate: request.body?.startDate,
      endDate: request.body?.endDate,
      allDay: request.body?.allDay,
    };

    const savedEvent = await new schema(body).save();

    const event = await schema.findById(savedEvent._id).populate({
      path: 'user',
      select: 'firstName lastName username avatar',
    });

    response.status(statusCode.CREATED).json({ event });
  } catch (error) {
    response.status(statusCode.BAD_REQUEST).json({ error });
  }
}

async function updateEvent(req: Request, response: Response) {
  const request = req as IRequest;

  const { id } = request.params;

  await schema
    .findById(id)
    .then(async (eventInstance) => {
      if (eventInstance) {
        try {
          const body = {
            user: request.user._id,
            body: request.body?.body,
            title: request.body?.title,
            startDate: request.body?.startDate,
            endDate: request.body?.endDate,
            allDay: request.body?.allDay,
          };

          const event = await schema
            .findByIdAndUpdate(id, body, {
              new: true,
            })
            .populate({
              path: 'user',
              select: 'firstName lastName username avatar',
            });
          response.status(statusCode.OK).json({ event });
        } catch (error) {
          response.status(statusCode.BAD_REQUEST).json({ error });
        }
      } else {
        response
          .status(statusCode.BAD_REQUEST)
          .json({ error: 'event Not Exist' });
      }
    })
    .catch(() => {
      response
        .status(statusCode.BAD_REQUEST)
        .json({ error: 'event Not Exist' });
    });
}

async function deleteEvent(req: Request, response: Response) {
  const request = req as IRequest;

  const { id } = request.params;

  await schema
    .findByIdAndDelete(id)
    .populate({
      path: 'user',
      select: 'firstName lastName username avatar',
    })
    .then((event) => {
      if (event) {
        response.status(statusCode.OK).json({ event });
      } else {
        response
          .status(statusCode.BAD_REQUEST)
          .json({ error: 'event not exist' });
      }
    })
    .catch((error) => {
      response.status(statusCode.BAD_REQUEST).json({ error });
    });
}

async function search(request: Request, response: Response) {
  const pagination = calculatePagination(request);
  const searchQuery = request.query.query ?? '';

  let sort = '-createAt';

  switch (request.query.sort) {
    case 'a-z':
      sort = 'name';
      break;
    case 'z-a':
      sort = '-name';
      break;
    case 'latest':
      sort = '-createdAt';
      break;
    case 'oldest':
      sort = 'createdAt';
      break;
  }

  const queryFilter = {
    $or: [{ name: { $regex: searchQuery, $options: 'i' } }],
  };

  const total = await schema.countDocuments(queryFilter);

  await schema
    .find(queryFilter)
    .skip(pagination.skip)
    .limit(pagination.limit)
    .sort(sort)
    .populate({
      path: 'user',
      select: 'firstName lastName username avatar',
    })
    .then((events) => {
      response.status(statusCode.OK).json({ events, total });
    })
    .catch((error) => {
      response.status(statusCode.BAD_REQUEST).json({ error });
    });
}

export default {
  allEvents,
  getEvent,
  createEvent,
  deleteEvent,
  updateEvent,
  search,
};
