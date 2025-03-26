import CrudService from '../core/CRUD';
import schema from '../schema/subscription.schema';
import { Request, Response } from 'express';
import statusCode from 'http-status-codes';

class SubscriptionController extends CrudService<Subscription> {
  constructor() {
    super(schema);
  }

  checkSubscription = async (request: Request, response: Response) => {
    const email = request.params.email;

    await schema
      .findOne({ email })
      .then((subscribe) => {
        if (subscribe) {
          response.status(statusCode.OK).json({ data: subscribe.isVerified });
        } else {
          response
            .status(statusCode.BAD_REQUEST)
            .json({ error: 'Email not subscribe' });
        }
      })
      .catch((error) => {
        response.status(statusCode.BAD_REQUEST).json({ error });
      });
  };
}

export default new SubscriptionController();
