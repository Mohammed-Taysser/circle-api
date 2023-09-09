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
      .then((subscription) => {
        response.status(statusCode.OK).json({ subscription, total });
      });
  } catch (error) {
    response.status(statusCode.INTERNAL_SERVER_ERROR).json({ error });
  }
}

async function subscribe(request: Request, response: Response) {
  const newSubscribe = new schema({
    email: request.body.email,
  });

  await newSubscribe
    .save()
    .then((subscribe) => {
      response.status(statusCode.OK).json({ subscribe });
    })
    .catch((error) => {
      response.status(statusCode.BAD_REQUEST).json({ error });
    });
}

// TODO: add verify email

export default { all, subscribe };
