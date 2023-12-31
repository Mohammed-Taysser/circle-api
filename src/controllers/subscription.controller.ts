import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import service from '../services/subscription.service';
import { calculatePagination } from '../utils/pagination';

async function all(request: Request, response: Response) {
  const pagination = calculatePagination(request);

  try {
    const total = await service.countDocuments();

    await service
      .all()
      .skip(pagination.skip)
      .limit(pagination.limit)
      .then((subscription) => {
        response.status(statusCode.OK).json({ subscription, total });
      });
  } catch (error) {
    response.status(statusCode.INTERNAL_SERVER_ERROR).json({ error });
  }
}

async function subscribe(request: Request, response: Response) {
  await service
    .save({
      email: request.body.email,
    })
    .then((subscribe) => {
      response.status(statusCode.OK).json({ subscribe });
    })
    .catch((error) => {
      response.status(statusCode.BAD_REQUEST).json({ error });
    });
}

async function isEmailSubscribe(request: Request, response: Response) {
  const email = request.query.email as string;

  await service
    .getByEmail(email)
    .then((subscribe) => {
      if (subscribe) {
        response.status(statusCode.OK).json({ subscribe });
      } else {
        response
          .status(statusCode.BAD_REQUEST)
          .json({ error: 'Email not subscribe' });
      }
    })
    .catch((error) => {
      response.status(statusCode.BAD_REQUEST).json({ error });
    });
}

export default { all, subscribe, isEmailSubscribe };
