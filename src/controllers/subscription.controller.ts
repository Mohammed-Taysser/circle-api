import { Request, Response } from 'express';
import statusCode from 'http-status-codes';
import schema from '../schema/subscription.schema';
import { calculatePagination } from '../utils/pagination';

async function all(request: Request, response: Response) {
  const pagination = calculatePagination(request);

  try {
    const total = await schema.countDocuments();

    await schema
      .find()
      .skip(pagination.skip)
      .limit(pagination.limit)
      .then((subscriptions) => {
        response.status(statusCode.OK).json({ subscriptions, total });
      });
  } catch (error) {
    response.status(statusCode.INTERNAL_SERVER_ERROR).json({ error });
  }
}

async function subscribe(request: Request, response: Response) {
  await new schema({
    email: request.body.email,
  })
    .save()
    .then((subscribe) => {
      response.status(statusCode.OK).json({ subscribe });
    })
    .catch((error) => {
      response.status(statusCode.BAD_REQUEST).json({ error });
    });
}

async function isEmailSubscribe(request: Request, response: Response) {
  const email = request.query.email as string;

  await schema
    .findOne({ email })
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
